import "server-only";
import { collectConnection } from "../catalog/catalog-pagination";
import { CART_QUERY } from "../graphql/cart-queries";
import { CART_ADD, CART_CREATE, CART_REMOVE, CART_UPDATE } from "../graphql/cart-mutations";
import { storefrontRequest } from "../storefront-client";
import { StorefrontError } from "../storefront-errors";
import type { CartConnection, CartMutationPayload, PublicCart, ShopifyCart } from "../types/cart-types";

export async function getCart(id: string | undefined, buyerIp?: string): Promise<ShopifyCart | null> {
  if (!id) return null;
  const fetchPage = async (after?: string) => {
    const data = await storefrontRequest<{ cart: CartConnection | null }>({
      document: CART_QUERY, variables: { id, after }, buyerIp,
    });
    return data.cart;
  };
  const cart = await fetchPage();
  if (!cart) return null;
  const lines = await collectConnection(cart.lines, async (after) => {
    const page = await fetchPage(after);
    if (!page) throw new StorefrontError("pagination", "Cart expired during pagination.");
    return page.lines;
  });
  return { ...cart, lines };
}
export function publicCart(cart: ShopifyCart, originalHandles: ReadonlySet<string> = new Set()): PublicCart {
  return { totalQuantity: cart.totalQuantity, cost: cart.cost, lines: cart.lines.map((line) => ({ ...line, isOriginal: originalHandles.has(line.merchandise.product.handle) })) };
}
/** No automatic retries: a transport failure may follow a successful mutation. */
export async function mutateCart(
  operation: "create" | "add" | "update" | "remove",
  variables: Record<string, unknown>,
  buyerIp?: string,
) {
  const documents = { create: CART_CREATE, add: CART_ADD, update: CART_UPDATE, remove: CART_REMOVE };
  const keys = { create: "cartCreate", add: "cartLinesAdd", update: "cartLinesUpdate", remove: "cartLinesRemove" };
  const data = await storefrontRequest<Record<string, CartMutationPayload>>({
    document: documents[operation], variables, buyerIp,
  });
  const payload = data[keys[operation]];
  if (!payload) throw new StorefrontError("invalid-response", "Missing cart mutation payload.");
  return payload;
}
export function validQuantity(value: number) {
  return Number.isInteger(value) && value > 0 && value <= 2_147_483_647;
}
export function quantityAllowed(quantity: number, rule: { minimum: number; maximum: number | null; increment: number }) {
  return validQuantity(quantity) && quantity >= rule.minimum &&
    (rule.maximum === null || quantity <= rule.maximum) && quantity % rule.increment === 0;
}
