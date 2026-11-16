import { StorefrontError } from "../storefront-errors";
import type { ShopifyConnection } from "../types/storefront-types";

/** Charge une connexion complète sans plafond local ni troncature silencieuse. */
export async function collectConnection<T>(
  firstPage: ShopifyConnection<T>,
  fetchNextPage: (after: string) => Promise<ShopifyConnection<T>>,
): Promise<T[]> {
  const nodes = [...firstPage.nodes];
  const seenCursors = new Set<string>();
  let page = firstPage;

  while (page.pageInfo.hasNextPage) {
    const cursor = page.pageInfo.endCursor;
    if (!cursor || seenCursors.has(cursor)) {
      throw new StorefrontError("pagination", "Pagination Shopify incohérente.");
    }
    seenCursors.add(cursor);
    page = await fetchNextPage(cursor);
    nodes.push(...page.nodes);
  }

  return nodes;
}
