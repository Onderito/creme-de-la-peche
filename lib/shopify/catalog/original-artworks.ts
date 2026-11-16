import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getCollectionProducts } from "./collection-service";
import { collectConnection } from "./catalog-pagination";

/** Shopify's original artworks collection defines which products are one of one. */
export async function getOriginalArtworkHandles(): Promise<string[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("shopify:catalog", "shopify:collections");
  const first = await getCollectionProducts({ handle: "creme-de-la-peche" }, { first: 100 });
  if (!first) throw new Error("Original artworks collection unavailable.");
  const products = await collectConnection(first.products, async (after) => {
    const next = await getCollectionProducts({ handle: "creme-de-la-peche" }, { first: 100, after });
    if (!next) throw new Error("Original artworks collection unavailable.");
    return next.products;
  });
  return products.map((product) => product.handle);
}
