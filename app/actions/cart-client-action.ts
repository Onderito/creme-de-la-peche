"use client";

import { changeCart } from "./cart-actions";
import type { CartActionState } from "@/lib/shopify/types/cart-types";
import type { FormEvent } from "react";

export function cartSubmitter(event: FormEvent<HTMLFormElement>) {
  const submitter = (event.nativeEvent as SubmitEvent).submitter;
  if (submitter instanceof HTMLElement) return submitter;
  return document.activeElement instanceof HTMLElement ? document.activeElement : null;
}

/** A failed browser request must not unmount the product or the cart. */
export async function changeCartSafely(previous: CartActionState, form: FormData): Promise<CartActionState> {
  try {
    return await changeCart(previous, form);
  } catch {
    // Never retry automatically: Shopify may already have received the change.
    return { error: true, message: "We couldn’t confirm the change. Check your connection, then refresh your cart before trying again." };
  }
}
