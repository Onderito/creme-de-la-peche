import "server-only";

import {
  COLLECTION_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_SUMMARY_FRAGMENT,
} from "./catalog-fragments";

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query CatalogCollections(
    $first: Int!, $after: String, $country: CountryCode, $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, after: $after) {
      nodes { ...CatalogCollection }
      pageInfo { ...CatalogPageInfo }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

function collectionQuery(argument: "id" | "handle") {
  return /* GraphQL */ `
  query CatalogCollectionBy${argument === "id" ? "Id" : "Handle"}(
    $identifier: ${argument === "id" ? "ID!" : "String!"}, $country: CountryCode, $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(${argument}: $identifier) { ...CatalogCollection }
  }
  ${COLLECTION_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;
}

export const COLLECTION_BY_ID_QUERY = collectionQuery("id");
export const COLLECTION_BY_HANDLE_QUERY = collectionQuery("handle");

function collectionProductsQuery(argument: "id" | "handle") {
  return /* GraphQL */ `
  query CatalogCollectionProductsBy${argument === "id" ? "Id" : "Handle"}(
    $identifier: ${argument === "id" ? "ID!" : "String!"}, $first: Int!, $after: String,
    $country: CountryCode, $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(${argument}: $identifier) {
      ...CatalogCollection
      products(first: $first, after: $after) {
        nodes { ...CatalogProductSummary }
        pageInfo { ...CatalogPageInfo }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_SUMMARY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;
}

export const COLLECTION_PRODUCTS_BY_ID_QUERY = collectionProductsQuery("id");
export const COLLECTION_PRODUCTS_BY_HANDLE_QUERY = collectionProductsQuery("handle");
