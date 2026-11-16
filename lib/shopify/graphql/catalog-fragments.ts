import "server-only";

export const PAGE_INFO_FRAGMENT = /* GraphQL */ `
  fragment CatalogPageInfo on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment CatalogImage on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment CatalogMoney on MoneyV2 {
    amount
    currencyCode
  }
`;

export const PRODUCT_SUMMARY_FRAGMENT = /* GraphQL */ `
  fragment CatalogProductSummary on Product {
    id
    handle
    title
    availableForSale
    onlineStoreUrl
    featuredImage { ...CatalogImage }
    priceRange {
      minVariantPrice { ...CatalogMoney }
      maxVariantPrice { ...CatalogMoney }
    }
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = /* GraphQL */ `
  fragment CatalogProductVariant on ProductVariant {
    id
    title
    availableForSale
    currentlyNotInStock
    price { ...CatalogMoney }
    compareAtPrice { ...CatalogMoney }
    image { ...CatalogImage }
    selectedOptions { name value }
    quantityRule { minimum maximum increment }
  }
`;

export const COLLECTION_FRAGMENT = /* GraphQL */ `
  fragment CatalogCollection on Collection {
    id
    handle
    title
    description
    image { ...CatalogImage }
  }
`;
