import "server-only";
import { randomInt } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { getProducts } from "./product-service";
import { collectConnection } from "./catalog-pagination";
import type { ProductSummary } from "../types/product-types";

async function suggestionPool() {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("shopify:catalog", "shopify:products");
  return collectConnection(await getProducts({ first: 250 }), (after) => getProducts({ first: 250, after }));
}

export function randomSelection(products: ProductSummary[], excludeId: string, count = 4) {
  const unique = new Map(products.filter((product) => product.id !== excludeId && product.availableForSale && product.featuredImage).map((product) => [product.id, product]));
  const candidates = [...unique.values()];
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, count);
}

/** Call inside a request-time Suspense boundary, after connection(). */
export async function getProductSuggestions(excludeId: string) {
  return randomSelection(await suggestionPool(), excludeId);
}
