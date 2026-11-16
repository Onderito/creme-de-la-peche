import type { ProductSummary } from "./product-types";
import type { ShopifyConnection, ShopifyImage } from "./storefront-types";

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}

export interface CollectionWithProducts extends Collection {
  products: ShopifyConnection<ProductSummary>;
}
