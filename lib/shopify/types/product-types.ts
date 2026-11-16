import type {
  ShopifyConnection,
  ShopifyImage,
  ShopifyMoney,
} from "./storefront-types";

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  currentlyNotInStock: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image: ShopifyImage | null;
  selectedOptions: { name: string; value: string }[];
  quantityRule: { minimum: number; maximum: number | null; increment: number };
}

export interface ProductSummary {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  onlineStoreUrl?: string | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
}

export interface Product extends ProductSummary {
  description: string;
  /** HTML marchand : à assainir avant tout rendu HTML dans le futur front. */
  descriptionHtml: string;
  vendor: string;
  productType: string;
  options: { name: string; values: string[] }[];
  seo: { title: string | null; description: string | null };
  images: ShopifyImage[];
  variants: ProductVariant[];
}

/** Forme de transport ; les services résolvent ensuite toutes les pages. */
export interface ProductWithConnections
  extends Omit<Product, "images" | "variants"> {
  images: ShopifyConnection<ShopifyImage>;
  variants: ShopifyConnection<ProductVariant>;
}
