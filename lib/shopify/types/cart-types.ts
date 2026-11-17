import type { ProductVariant } from "./product-types";
import type { ShopifyConnection, ShopifyMoney } from "./storefront-types";

export interface CartLine {
  id: string;
  quantity: number;
  instructions: { canRemove: boolean; canUpdateQuantity: boolean };
  merchandise: ProductVariant & {
    product: { title: string; handle: string; onlineStoreUrl: string | null; options: { name: string; values: string[] }[] };
  };
  cost: { amountPerQuantity: ShopifyMoney; totalAmount: ShopifyMoney };
}
/** Private transport shape. Never pass to a Client Component. */
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: ShopifyMoney; totalAmount: ShopifyMoney };
  lines: CartLine[];
}
export interface CartConnection extends Omit<ShopifyCart, "lines"> {
  lines: ShopifyConnection<CartLine>;
}
export interface PublicCart extends Omit<ShopifyCart, "id" | "checkoutUrl" | "lines"> {
  lines: (CartLine & { isOriginal: boolean })[];
}
export interface CartConfirmation {
  title: string;
  options: string;
  quantity: number;
  price: ShopifyMoney;
  image: { url: string; altText: string | null } | null;
  alreadyInCart: boolean;
  warning?: string;
}
export interface CartActionState { message: string; error?: boolean; confirmation?: CartConfirmation }
export interface CartMutationPayload {
  cart: { id: string } | null;
  userErrors: { code: string | null; field: string[] | null; message: string }[];
  warnings: { code: string; message: string }[];
}
