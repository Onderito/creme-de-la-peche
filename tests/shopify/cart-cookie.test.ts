import assert from "node:assert/strict";
import { test } from "node:test";
import { usableCartId } from "../../lib/shopify/cart/cart-id";

test("malformed or foreign cart cookies are ignored so a new cart can be created", () => {
  for (const value of [undefined, "", "not-a-valid-cart", "https://example.com/Cart/test?key=test", "gid://other/Cart/test?key=test", "gid://shopify/Product/test?key=test", "gid://shopify/Cart/test", "gid://shopify/Cart/test?key=", "gid://shopify/Cart/test?key=test#fragment", "gid://shopify/Cart/test?key=with space", "x".repeat(2049)]) {
    assert.equal(usableCartId(value), undefined);
  }
});

test("a full Shopify cart ID retains its private key without rewriting", () => {
  const value = "gid://shopify/Cart/example-cart_123?key=example-key_456";
  assert.equal(usableCartId(value), value);
});
