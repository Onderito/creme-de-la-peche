import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";

import { getShopifyConfig, SHOPIFY_API_VERSION } from "../../lib/shopify/shopify-config";
import { storefrontRequest } from "../../lib/shopify/storefront-client";
import { StorefrontError } from "../../lib/shopify/storefront-errors";

const originalDomain = process.env.SHOPIFY_STORE_DOMAIN;
const originalToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const TEST_TOKEN = "private-token-for-tests-only";

beforeEach(() => {
  process.env.SHOPIFY_STORE_DOMAIN = "test-boutique.myshopify.com";
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = TEST_TOKEN;
});

afterEach(() => {
  mock.restoreAll();
  if (originalDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
  else process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
  if (originalToken === undefined) delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  else process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = originalToken;
});

test("envoie le jeton privé au bon endpoint, sans cache et sans redirection", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () =>
    Response.json({ data: { product: { price: { amount: "29.90", currencyCode: "EUR" } } } }),
  );
  const result = await storefrontRequest<{ product: { price: { amount: string } } }>({
    document: "query Product($handle: String) { product(handle: $handle) { id } }",
    variables: { handle: "un-produit" },
  });

  const [url, options] = fetchMock.mock.calls[0].arguments as unknown as [string, RequestInit];
  assert.equal(url, `https://test-boutique.myshopify.com/api/${SHOPIFY_API_VERSION}/graphql.json`);
  assert.equal(options.method, "POST");
  assert.equal(options.cache, "no-store");
  assert.equal(options.redirect, "error");
  const headers = new Headers(options.headers);
  assert.equal(headers.get("Shopify-Storefront-Private-Token"), TEST_TOKEN);
  assert.equal(headers.has("X-Shopify-Storefront-Access-Token"), false);
  assert.equal(headers.has("Shopify-Storefront-Buyer-IP"), false);
  assert.deepEqual(JSON.parse(options.body as string).variables, { handle: "un-produit" });
  assert.equal(result.product.price.amount, "29.90");
});

test("refuse un hôte arbitraire avant tout envoi du jeton", async () => {
  process.env.SHOPIFY_STORE_DOMAIN = "test-boutique.myshopify.com.attacker.example";
  const fetchMock = mock.method(globalThis, "fetch", async () => Response.json({ data: {} }));
  await assert.rejects(storefrontRequest({ document: "query { shop { name } }" }), {
    name: "StorefrontError", kind: "configuration",
  });
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("accepte le domaine permanent avec HTTPS mais refuse chemin, port et HTTP", () => {
  process.env.SHOPIFY_STORE_DOMAIN = "https://test-boutique.myshopify.com/";
  assert.equal(getShopifyConfig().domain, "test-boutique.myshopify.com");
  for (const domain of ["http://test-boutique.myshopify.com", "test-boutique.myshopify.com/path", "test-boutique.myshopify.com:8080"]) {
    process.env.SHOPIFY_STORE_DOMAIN = domain;
    assert.throws(() => getShopifyConfig(), { kind: "configuration" });
  }
});

test("un jeton absent ne provoque aucun appel réseau", async () => {
  delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const fetchMock = mock.method(globalThis, "fetch", async () => Response.json({ data: {} }));
  await assert.rejects(storefrontRequest({ document: "query { shop { name } }" }), { kind: "configuration" });
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("remonte les erreurs HTTP sans exposer le corps reçu", async () => {
  mock.method(globalThis, "fetch", async () => new Response(TEST_TOKEN, { status: 401 }));
  await assert.rejects(storefrontRequest({ document: "query { shop { name } }" }), (error: unknown) => {
    assert.ok(error instanceof StorefrontError);
    assert.equal(error.kind, "http");
    assert.equal(error.status, 401);
    assert.equal(String(error).includes(TEST_TOKEN), false);
    return true;
  });
});

test("rejette les données partielles GraphQL et conserve uniquement les codes sûrs", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({
    data: { products: [] },
    errors: [{ message: TEST_TOKEN, extensions: { code: "ACCESS_DENIED" } }],
  }));
  await assert.rejects(storefrontRequest({ document: "query { products(first: 1) { nodes { id } } }" }), (error: unknown) => {
    assert.ok(error instanceof StorefrontError);
    assert.equal(error.kind, "graphql");
    assert.deepEqual(error.codes, ["ACCESS_DENIED"]);
    assert.equal(JSON.stringify(error).includes(TEST_TOKEN), false);
    return true;
  });
});

test("ne conserve pas une cause réseau susceptible de contenir des secrets", async () => {
  mock.method(globalThis, "fetch", async () => { throw new Error(TEST_TOKEN); });
  await assert.rejects(storefrontRequest({ document: "query { shop { name } }" }), (error: unknown) => {
    assert.ok(error instanceof StorefrontError);
    assert.equal(error.kind, "network");
    assert.equal(error.cause, undefined);
    assert.equal(String(error).includes(TEST_TOKEN), false);
    return true;
  });
});

test("rejette les réponses non JSON et celles sans données", async () => {
  for (const response of [new Response("not json"), Response.json({ data: null }), Response.json([])]) {
    mock.method(globalThis, "fetch", async () => response);
    await assert.rejects(storefrontRequest({ document: "query { shop { name } }" }), { kind: "invalid-response" });
    mock.restoreAll();
  }
});

test("transmet une IP acheteur valide et refuse une valeur arbitraire", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () => Response.json({ data: { cart: null } }));
  await storefrontRequest({ document: "query { cart(id: null) { id } }", buyerIp: "2001:db8::1" });
  const [, options] = fetchMock.mock.calls[0].arguments as unknown as [string, RequestInit];
  assert.equal(new Headers(options.headers).get("Shopify-Storefront-Buyer-IP"), "2001:db8::1");
  await assert.rejects(storefrontRequest({ document: "query { shop { name } }", buyerIp: "not-an-ip" }), { kind: "input" });
  assert.equal(fetchMock.mock.callCount(), 1);
});
