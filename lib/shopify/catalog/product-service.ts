import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  PRODUCT_IMAGES_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCT_BY_ID_QUERY,
  PRODUCT_VARIANTS_QUERY,
  PRODUCTS_QUERY,
} from "../graphql/product-queries";
import { StorefrontError } from "../storefront-errors";
import { storefrontRequest } from "../storefront-client";
import type {
  Product,
  ProductSummary,
  ProductVariant,
  ProductWithConnections,
} from "../types/product-types";
import type {
  CatalogContext,
  CatalogIdentifier,
  CatalogPagination,
  ShopifyConnection,
  ShopifyImage,
} from "../types/storefront-types";
import { contextVariables, resolveIdentifier, paginationVariables } from "./catalog-inputs";
import { collectConnection } from "./catalog-pagination";

const DETAIL_PAGE_SIZE = 100;

export async function getProducts(
  pagination: CatalogPagination = {},
  context: CatalogContext = {},
): Promise<ShopifyConnection<ProductSummary>> {
  return getCachedProducts(paginationVariables(pagination), contextVariables(context));
}

async function getCachedProducts(
  pagination: ReturnType<typeof paginationVariables>,
  context: ReturnType<typeof contextVariables>,
): Promise<ShopifyConnection<ProductSummary>> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("shopify:catalog", "shopify:products");

  const data = await storefrontRequest<{ products: ShopifyConnection<ProductSummary> }>({
    document: PRODUCTS_QUERY,
    variables: { ...pagination, ...context },
  });
  return data.products;
}

/** Une fiche contient toutes ses variantes et images, même au-delà d’une page. */
export async function getProduct(
  identifier: CatalogIdentifier,
  context: CatalogContext = {},
): Promise<Product | null> {
  return getCachedProduct(resolveIdentifier(identifier), contextVariables(context));
}

async function getCachedProduct(
  identifier: ReturnType<typeof resolveIdentifier>,
  market: ReturnType<typeof contextVariables>,
): Promise<Product | null> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("shopify:catalog", "shopify:products");

  const data = await storefrontRequest<{ product: ProductWithConnections | null }>({
    document: identifier.argument === "id" ? PRODUCT_BY_ID_QUERY : PRODUCT_BY_HANDLE_QUERY,
    variables: { identifier: identifier.value, ...market, first: DETAIL_PAGE_SIZE },
  });
  const product = data.product;
  if (!product) return null;

  const variables = { id: product.id, first: DETAIL_PAGE_SIZE, ...market };
  const [variants, images] = await Promise.all([
    collectConnection(product.variants, async (after) => {
      const next = await storefrontRequest<{
        product: { variants: ShopifyConnection<ProductVariant> } | null;
      }>({ document: PRODUCT_VARIANTS_QUERY, variables: { ...variables, after } });
      if (!next.product) {
        throw new StorefrontError("pagination", "Produit indisponible pendant la pagination.");
      }
      return next.product.variants;
    }),
    collectConnection(product.images, async (after) => {
      const next = await storefrontRequest<{
        product: { images: ShopifyConnection<ShopifyImage> } | null;
      }>({ document: PRODUCT_IMAGES_QUERY, variables: { ...variables, after } });
      if (!next.product) {
        throw new StorefrontError("pagination", "Produit indisponible pendant la pagination.");
      }
      return next.product.images;
    }),
  ]);

  return { ...product, variants, images };
}
