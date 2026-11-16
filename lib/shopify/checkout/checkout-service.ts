import "server-only";
import { getCart } from "../cart/cart-service";
import { hasDuplicateOriginals } from "../cart/original-rules";

export class OriginalQuantityError extends Error {}

export async function getCheckoutUrl(cartId: string | undefined, originalHandles: ReadonlySet<string>, ip?: string) {
  const cart = await getCart(cartId, ip);
  if (!cart || cart.totalQuantity === 0) return null;
  if (hasDuplicateOriginals(cart.lines, originalHandles)) throw new OriginalQuantityError("Original artworks are limited to one per product.");
  const url = new URL(cart.checkoutUrl);
  if (url.protocol !== "https:") throw new Error("Invalid checkout URL.");
  return cart.checkoutUrl;
}
