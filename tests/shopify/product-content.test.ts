import assert from "node:assert/strict";
import { test } from "node:test";
import { productContent } from "../../lib/shopify/catalog/product-content";
import { randomSelection } from "../../lib/shopify/catalog/product-suggestions";
import type { ProductSummary } from "../../lib/shopify/types/product-types";

test("merchant descriptions preserve text and measurements without executable markup", () => {
  const result = productContent('<p style="color:red" onclick="alert(1)">Cotton <strong>tee</strong></p><script>alert(1)</script><a href="javascript:alert(1)">Unsafe</a><iframe src="https://example.com"></iframe><table style="width:2000px"><tbody><tr><th scope="row">Width</th><td>45.72</td></tr></tbody></table>');
  assert.match(result.description, /Cotton <strong>tee<\/strong>/);
  assert.doesNotMatch(result.description + result.measurements, /script|onclick|style=|iframe|javascript:/i);
  assert.match(result.measurements, /<table><tbody><tr><th scope="row">Width<\/th><td>45.72/);
  assert.doesNotMatch(result.description, /<table>/);
});

test("safe merchant links and multiple tables remain readable", () => {
  const result = productContent('<p>Made by hand. <a href="https://example.com/care">Care instructions</a></p><table><tr><td>cm</td></tr></table><p>More details.</p><table><tr><td>in</td></tr></table>');
  assert.match(result.description, /More details/);
  assert.match(result.description, /href="https:\/\/example.com\/care"/);
  assert.equal(result.measurements.match(/<table>/g)?.length, 2);
});

function product(id: string, overrides: Partial<ProductSummary> = {}): ProductSummary {
  return { id, handle: id, title: id, availableForSale: true,
    featuredImage: { url: `https://cdn.shopify.com/${id}.jpg`, altText: null, width: 100, height: 100 },
    priceRange: { minVariantPrice: { amount: "10", currencyCode: "EUR" }, maxVariantPrice: { amount: "10", currencyCode: "EUR" } },
    ...overrides,
  };
}

test("suggestions exclude current, sold out, imageless and duplicate products", () => {
  const products = [product("current"), product("sold", { availableForSale: false }), product("no-image", { featuredImage: null }), product("a"), product("a"), product("b"), product("c"), product("d"), product("e")];
  const before = [...products];
  const selected = randomSelection(products, "current");
  assert.equal(selected.length, 4);
  assert.equal(new Set(selected.map((item) => item.id)).size, 4);
  assert.ok(selected.every((item) => ["a", "b", "c", "d", "e"].includes(item.id)));
  assert.deepEqual(products, before);
  assert.equal(randomSelection([product("current")], "current").length, 0);
});
