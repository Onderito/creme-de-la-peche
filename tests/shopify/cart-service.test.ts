import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { getCart, mutateCart, publicCart, quantityAllowed } from "../../lib/shopify/cart/cart-service";
import { getCheckoutUrl } from "../../lib/shopify/checkout/checkout-service";
import type { ShopifyCart } from "../../lib/shopify/types/cart-types";
import { hasDuplicateOriginals, originalCartIssue } from "../../lib/shopify/cart/original-rules";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
beforeEach(() => {
  process.env.SHOPIFY_STORE_DOMAIN = "test-boutique.myshopify.com";
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";
});
afterEach(() => {
  mock.restoreAll();
  if (domain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
  else process.env.SHOPIFY_STORE_DOMAIN = domain;
  if (token === undefined) delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  else process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = token;
});
const id = "gid://shopify/Cart/test?key=private-cart-secret";
const money = { amount: "29.90", currencyCode: "EUR" };
function page(next = false, cursor: string | null = null) {
  return { id, checkoutUrl: "https://checkout.example/checkouts/test", totalQuantity: 1,
    cost: { subtotalAmount: money, totalAmount: money },
    lines: { nodes: [], pageInfo: { hasNextPage: next, hasPreviousPage: false, startCursor: cursor, endCursor: cursor } },
  };
}

test("absent cart never creates a cart or calls Shopify", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => Response.json({ data: {} }));
  assert.equal(await getCart(undefined), null);
  assert.equal(fetch.mock.callCount(), 0);
});
test("reads all cart pages with the full private ID and no cache", async () => {
  const fetch = mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    const { variables } = JSON.parse(String(options.body));
    assert.equal(variables.id, id);
    assert.equal(options.cache, "no-store");
    return Response.json({ data: { cart: variables.after ? page() : page(true, "next") } });
  });
  const cart = await getCart(id);
  assert.equal(cart?.id, id);
  assert.equal(fetch.mock.callCount(), 2);
});
test("expired carts and upstream failures remain distinct", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ data: { cart: null } }));
  assert.equal(await getCart(id), null);
  mock.restoreAll();
  mock.method(globalThis, "fetch", async () => new Response("failure", { status: 503 }));
  await assert.rejects(getCart(id), { kind: "http" });
});
test("public cart omits both private ID and checkout URL", () => {
  const cart = { ...page(), lines: [] } as ShopifyCart;
  const view = publicCart(cart);
  assert.equal("id" in view, false);
  assert.equal("checkoutUrl" in view, false);
  assert.equal(JSON.stringify(view).includes("private-cart-secret"), false);
  assert.deepEqual(view.cost.totalAmount, money);
});
test("mutations preserve Shopify errors and warnings and never retry", async () => {
  const payload = { cart: { id }, userErrors: [{ code: "INVALID", field: ["lines"], message: "Invalid quantity" }], warnings: [{ code: "MERCHANDISE_NOT_ENOUGH_STOCK", message: "Adjusted" }] };
  mock.method(globalThis, "fetch", async () => Response.json({ data: { cartLinesUpdate: payload } }));
  assert.deepEqual(await mutateCart("update", { cartId: id, lines: [] }), payload);
  mock.restoreAll();
  const fetch = mock.method(globalThis, "fetch", async () => { throw new Error("offline"); });
  await assert.rejects(mutateCart("add", { cartId: id, lines: [] }));
  assert.equal(fetch.mock.callCount(), 1);
});
test("quantity validation follows Shopify rules rather than a local cap", () => {
  const rule = { minimum: 6, maximum: 30, increment: 3 };
  for (const value of [0, -1, 2.5, 4, 7, 33, NaN, Infinity]) assert.equal(quantityAllowed(value, rule), false);
  for (const value of [6, 9, 30]) assert.equal(quantityAllowed(value, rule), true);
  assert.equal(quantityAllowed(1000, { minimum: 1, maximum: null, increment: 1 }), true);
});
test("checkout freshly reads Shopify and refuses empty carts", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ data: { cart: page() } }));
  assert.equal(await getCheckoutUrl(id, new Set()), page().checkoutUrl);
  mock.restoreAll();
  mock.method(globalThis, "fetch", async () => Response.json({ data: { cart: { ...page(), totalQuantity: 0 } } }));
  assert.equal(await getCheckoutUrl(id, new Set()), null);
});

const selectionLine = (id: string, handle: string, quantity: number) => ({ id, quantity, merchandise: { product: { handle } } });

test("an original is limited to one per product, including separate variant lines", () => {
  const lines = [selectionLine("first-variant", "original", 1), selectionLine("tee-line", "tee", 3)];
  assert.equal(originalCartIssue(1, "new-original", lines), null);
  assert.equal(originalCartIssue(2, "original", []), "quantity");
  assert.equal(originalCartIssue(1, "original", lines), "duplicate");
  assert.equal(originalCartIssue(1, "original", lines, "first-variant"), null);
  assert.equal(originalCartIssue(2, "original", lines, "first-variant"), "quantity");
  assert.equal(hasDuplicateOriginals(lines, new Set(["original"])), false);
  assert.equal(hasDuplicateOriginals([...lines, selectionLine("second-variant", "original", 1)], new Set(["original"])), true);
  assert.equal(hasDuplicateOriginals([selectionLine("one-line", "original", 2)], new Set(["original"])), true);
});

test("checkout blocks duplicate originals while allowing multiple prints and tees", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ data: { cart: { ...page(), lines: { ...page().lines, nodes: [selectionLine("line", "original", 2)] } } } }));
  await assert.rejects(getCheckoutUrl(id, new Set(["original"])), /limited to one per product/);
  mock.restoreAll();
  mock.method(globalThis, "fetch", async () => Response.json({ data: { cart: { ...page(), totalQuantity: 3, lines: { ...page().lines, nodes: [selectionLine("line", "tee", 3)] } } } }));
  assert.equal(await getCheckoutUrl(id, new Set(["original"])), page().checkoutUrl);
});
