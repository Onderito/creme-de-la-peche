import { readCartId } from "@/lib/shopify/cart/cart-cookie";
import { getCart } from "@/lib/shopify/cart/cart-service";
import { buyerIp } from "@/lib/shopify/request/buyer-ip";

/** Number of pieces in the visitor's cart, shown next to the header link. */
export async function CartCount() {
  let count = 0;
  try {
    const [id, ip] = await Promise.all([readCartId(), buyerIp()]);
    count = (await getCart(id, ip))?.totalQuantity ?? 0;
  } catch {
    return null;
  }
  if (!count) return null;
  return <sup className="cart-count"><span className="sr-only">, </span>{count}<span className="sr-only"> {count > 1 ? "items" : "item"}</span></sup>;
}
