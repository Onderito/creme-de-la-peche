export interface ShopifyMoney {
  /** Conserver la précision décimale renvoyée par Shopify. */
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ShopifyConnection<T> {
  nodes: T[];
  pageInfo: ShopifyPageInfo;
}

export interface CatalogPagination {
  first?: number;
  after?: string;
}

/** Contexte public du catalogue ; aucune donnée d’un acheteur connecté. */
export interface CatalogContext {
  country?: string;
  language?: string;
}

/** Fournir exactement un identifiant. */
export type CatalogIdentifier =
  | { handle: string; id?: never }
  | { id: string; handle?: never };

export type StorefrontErrorKind =
  | "configuration"
  | "input"
  | "network"
  | "http"
  | "graphql"
  | "invalid-response"
  | "pagination";

export interface StorefrontRequest {
  document: string;
  variables?: Record<string, unknown>;
  /** Pour les futurs appels panier ; absent des services catalogue mis en cache. */
  buyerIp?: string;
  signal?: AbortSignal;
}
