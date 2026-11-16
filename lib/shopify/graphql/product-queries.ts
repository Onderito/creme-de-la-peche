import "server-only";

import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_SUMMARY_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
} from "./catalog-fragments";

export const PRODUCTS_QUERY = /* GraphQL */ `
  query CatalogProducts(
    $first: Int!, $after: String, $country: CountryCode, $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, after: $after) {
      nodes { ...CatalogProductSummary }
      pageInfo { ...CatalogPageInfo }
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

// Shopify exige un seul argument, même lorsque l’autre vaudrait null.
function productQuery(argument: "id" | "handle") {
  return /* GraphQL */ `
  query CatalogProductBy${argument === "id" ? "Id" : "Handle"}(
    $identifier: ${argument === "id" ? "ID!" : "String!"}, $first: Int!,
    $country: CountryCode, $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(${argument}: $identifier) {
      ...CatalogProductSummary
      description
      descriptionHtml
      vendor
      productType
      options { name values }
      seo { title description }
      images(first: $first) {
        nodes { ...CatalogImage }
        pageInfo { ...CatalogPageInfo }
      }
      variants(first: $first) {
        nodes { ...CatalogProductVariant }
        pageInfo { ...CatalogPageInfo }
      }
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;
}

export const PRODUCT_BY_ID_QUERY = productQuery("id");
export const PRODUCT_BY_HANDLE_QUERY = productQuery("handle");

export const PRODUCT_VARIANTS_QUERY = /* GraphQL */ `
  query CatalogProductVariants(
    $id: ID!, $first: Int!, $after: String,
    $country: CountryCode, $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(id: $id) {
      variants(first: $first, after: $after) {
        nodes { ...CatalogProductVariant }
        pageInfo { ...CatalogPageInfo }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const PRODUCT_IMAGES_QUERY = /* GraphQL */ `
  query CatalogProductImages(
    $id: ID!, $first: Int!, $after: String,
    $country: CountryCode, $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(id: $id) {
      images(first: $first, after: $after) {
        nodes { ...CatalogImage }
        pageInfo { ...CatalogPageInfo }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;
