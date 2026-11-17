"use client";

import { useActionState, useId, useState } from "react";
import { useCartConfirmation } from "@/app/components/cart-confirmation";
import { changeCart } from "@/app/actions/cart-actions";
import { formatMoney } from "@/lib/shopify/format-money";
import type { ProductVariant } from "@/lib/shopify/types/product-types";
import styles from "../cart/cart.module.css";

type Option = Pick<ProductVariant, "id" | "title" | "price" | "availableForSale">;

export function AddToCart({ handle, title, variants, compact = false }: {
  handle: string; title: string; variants: Option[]; compact?: boolean;
}) {
  const showConfirmation = useCartConfirmation();
  const [state, action, pending] = useActionState(async (previous: Parameters<typeof changeCart>[0], form: FormData) => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const result = await changeCart(previous, form);
    if (result.confirmation) showConfirmation(result.confirmation, trigger);
    return result;
  }, { message: "" });
  const available = variants.filter((variant) => variant.availableForSale);
  const [selectedId, setSelectedId] = useState(available[0]?.id ?? "");
  const selected = available.find((variant) => variant.id === selectedId) ?? available[0];
  const id = useId();

  if (!selected) return null;

  return (
    <form action={action} className={compact ? styles.quickAdd : styles.addForm} aria-label={`Add ${title} to cart`}>
      <input type="hidden" name="operation" value="add" />
      <input type="hidden" name="handle" value={handle} />

      {available.length > 1 ? (
        <div className={styles.option}>
          <label htmlFor={id}>Choose an option</label>
          <select id={id} name="variantId" value={selected.id} onChange={(event) => setSelectedId(event.target.value)} disabled={pending}>
            {available.map((variant) => <option key={variant.id} value={variant.id}>{variant.title} — {formatMoney(variant.price)}</option>)}
          </select>
        </div>
      ) : <input type="hidden" name="variantId" value={selected.id} />}
      <button className={styles.addButton} type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add to cart"}
      </button>
      <p className={styles.feedback} aria-live="polite">{state.error ? state.message : ""}</p>
    </form>
  );
}
