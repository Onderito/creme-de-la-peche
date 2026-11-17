"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProduct } from "@/lib/shopify/catalog/product-service";
import { getOriginalArtworkHandles } from "@/lib/shopify/catalog/original-artworks";
import { originalCartIssue } from "@/lib/shopify/cart/original-rules";
import { clearCartId, readCartId, saveCartId } from "@/lib/shopify/cart/cart-cookie";
import { getCart, mutateCart, quantityAllowed } from "@/lib/shopify/cart/cart-service";
import { buyerIp } from "@/lib/shopify/request/buyer-ip";
import type { CartActionState } from "@/lib/shopify/types/cart-types";

export async function changeCart(_previous: CartActionState, form: FormData): Promise<CartActionState> {
  const operation = form.get("operation");
  let message = "";
  let confirmation: CartActionState["confirmation"];
  try {
    const ip = await buyerIp();
    const [cart, originalHandles] = await Promise.all([getCart(await readCartId(), ip), getOriginalArtworkHandles()]);
    let payload;
    let selectedVariantId: string | undefined;
    let selectedHandle: string | undefined;
    let alreadyInCart = false;
    if (operation === "add") {
      const handle = form.get("handle");
      const variantId = form.get("variantId");
      if (typeof handle !== "string" || typeof variantId !== "string") {
        return { message: "Please choose an option first.", error: true };
      }
      const product = await getProduct({ handle });
      const variant = product?.variants.find((item) => item.id === variantId && item.availableForSale);
      if (!variant) return { message: "This option is no longer available. Please choose another.", error: true };
      const requestedQuantity = form.get("quantity");
      const quantity = requestedQuantity === null ? variant.quantityRule.minimum : Number(requestedQuantity);
      if (!quantityAllowed(quantity, variant.quantityRule)) {
        return { message: "This quantity is not available for this piece.", error: true };
      }
      const originalIssue = originalHandles.includes(handle) ? originalCartIssue(quantity, handle, cart?.lines ?? []) : null;
      if (originalIssue === "quantity") return { message: "This original is one of a kind. Only one per cart.", error: true };
      selectedVariantId = variant.id;
      selectedHandle = handle;
      alreadyInCart = originalIssue === "duplicate";
      const lines = [{ merchandiseId: variant.id, quantity }];
      // Repeated additions open the existing cart without increasing its quantity.
      payload = originalIssue === "duplicate" && cart
        ? { cart: { id: cart.id }, userErrors: [], warnings: [] }
        : cart
        ? await mutateCart("add", { cartId: cart.id, lines }, ip)
        : await mutateCart("create", { input: { lines } }, ip);
    } else if (operation === "update" || operation === "remove") {
      if (!cart) {
        await clearCartId();
        revalidatePath("/cart");
        return { message: "Your cart has expired. Please add your pieces again.", error: true };
      }
      const line = cart.lines.find((item) => item.id === form.get("lineId"));
      if (!line) return { message: "This piece is no longer in your cart. Refresh to see your current selection.", error: true };
      if (operation === "remove") {
        if (!line.instructions.canRemove) return { message: "This piece cannot be removed separately.", error: true };
        payload = await mutateCart("remove", { cartId: cart.id, lineIds: [line.id] }, ip);
      } else {
        const quantity = Number(form.get("quantity"));
        if (originalHandles.includes(line.merchandise.product.handle) && originalCartIssue(quantity, line.merchandise.product.handle, cart.lines, line.id)) {
          return { message: "This original is one of a kind. Only one per cart.", error: true };
        }
        if (!line.instructions.canUpdateQuantity || !quantityAllowed(quantity, line.merchandise.quantityRule)) {
          return { message: "This quantity is not available for this piece.", error: true };
        }
        payload = await mutateCart("update", { cartId: cart.id, lines: [{ id: line.id, quantity }] }, ip);
      }
    } else return { message: "Please try again.", error: true };
    if (payload.cart) await saveCartId(payload.cart.id);
    revalidatePath("/cart");
    if (payload.userErrors.length) {
      return { message: "We couldn’t update your cart. Check the available options and quantities, then try again.", error: true };
    }
    if (!payload.cart) return { message: "Your cart is no longer available. Please refresh and try again.", error: true };
    const updatedCart = await getCart(payload.cart.id, ip);
    if (!updatedCart) {
      return { message: "Your cart is no longer available. Please refresh and try again.", error: true };
    }
    if (payload.warnings.length) message = "Your cart has changed. Please check your selection before continuing.";
    if (operation === "add") {
      const line = updatedCart.lines.find((item) => alreadyInCart ? item.merchandise.product.handle === selectedHandle : item.merchandise.id === selectedVariantId);
      if (!line) return { message: message || "This piece could not be added. Please check your cart.", error: true };
      const variant = line.merchandise;
      confirmation = {
        title: variant.product.title,
        options: variant.selectedOptions.filter((option) => variant.product.options.some((item) => item.name === option.name && item.values.length > 1)).map((option) => option.value).join(" / "),
        quantity: line.quantity,
        price: line.cost.totalAmount,
        image: variant.image ? { url: variant.image.url, altText: variant.image.altText } : null,
        alreadyInCart,
        warning: message || undefined,
      };
    }
  } catch {
    revalidatePath("/cart");
    return { message: "We couldn’t confirm the change. Refresh your cart before trying again.", error: true };
  }
  if (operation === "add" && form.get("goToCart") === "true") redirect(message ? "/cart?notice=adjusted" : "/cart");
  return { message, confirmation };
}
