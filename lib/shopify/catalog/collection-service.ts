import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  COLLECTION_PRODUCTS_BY_HANDLE_QUERY,
  COLLECTION_PRODUCTS_BY_ID_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  COLLECTION_BY_ID_QUERY,
  COLLECTIONS_QUERY,
} from "../graphql/collection-queries";
import { storefrontRequest } from "../storefront-client";
import type { Collection, CollectionWithProducts } from "../types/collection-types";
import type {
  CatalogContext,
  CatalogIdentifier,
  CatalogPagination,
  ShopifyConnection,
} from "../types/storefront-types";
import { contextVariables, resolveIdentifier, paginationVariables } from "./catalog-inputs";

export async function getCollections(
  pagination: CatalogPagination = {},
  context: CatalogContext = {},
): Promise<ShopifyConnection<Collection>> {
  return getCachedCollections(paginationVariables(pagination), contextVariables(context));
}

async function getCachedCollections(
  pagination: ReturnType<typeof paginationVariables>,
  context: ReturnType<typeof contextVariables>,
): Promise<ShopifyConnection<Collection>> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("shopify:catalog", "shopify:collections");

  const data = await storefrontRequest<{ collections: ShopifyConnection<Collection> }>({
    document: COLLECTIONS_QUERY,
    variables: { ...pagination, ...context },
  });
  return data.collections;
}

export async function getCollection(
  identifier: CatalogIdentifier,
  context: CatalogContext = {},
): Promise<Collection | null> {
  return getCachedCollection(resolveIdentifier(identifier), contextVariables(context));
}

async function getCachedCollection(
  identifier: ReturnType<typeof resolveIdentifier>,
  context: ReturnType<typeof contextVariables>,
): Promise<Collection | null> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("shopify:catalog", "shopify:collections");

  const data = await storefrontRequest<{ collection: Collection | null }>({
    document: identifier.argument === "id" ? COLLECTION_BY_ID_QUERY : COLLECTION_BY_HANDLE_QUERY,
    variables: { identifier: identifier.value, ...context },
  });
  return data.collection;
}

export async function getCollectionProducts(
  identifier: CatalogIdentifier,
  pagination: CatalogPagination = {},
  context: CatalogContext = {},
): Promise<CollectionWithProducts | null> {
  return getCachedCollectionProducts(
    resolveIdentifier(identifier), paginationVariables(pagination), contextVariables(context),
  );
}

async function getCachedCollectionProducts(
  identifier: ReturnType<typeof resolveIdentifier>,
  pagination: ReturnType<typeof paginationVariables>,
  context: ReturnType<typeof contextVariables>,
): Promise<CollectionWithProducts | null> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("shopify:catalog", "shopify:collections", "shopify:products");

  const data = await storefrontRequest<{ collection: CollectionWithProducts | null }>({
    document: identifier.argument === "id" ? COLLECTION_PRODUCTS_BY_ID_QUERY : COLLECTION_PRODUCTS_BY_HANDLE_QUERY,
    variables: {
      identifier: identifier.value,
      ...pagination,
      ...context,
    },
  });
  return data.collection;
}
