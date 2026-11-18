"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { formatMoney } from "@/lib/shopify/format-money";
import type { CartConfirmation } from "@/lib/shopify/types/cart-types";
import styles from "./cart-confirmation.module.css";

const CartConfirmationContext = createContext<(item: CartConfirmation, trigger: HTMLElement | null) => void>(() => {});
export const useCartConfirmation = () => useContext(CartConfirmationContext);

export function CartConfirmationProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<CartConfirmation | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const open = useCallback((confirmation: CartConfirmation, trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    setItem(confirmation);
  }, []);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (item && dialog && !dialog.open) dialog.showModal();
  }, [item]);
  function close() { dialogRef.current?.close(); }
  return <CartConfirmationContext.Provider value={open}>
    {children}
    <dialog ref={dialogRef} data-lenis-prevent className={styles.dialog} aria-labelledby="cart-confirmation-title" onClose={() => { setItem(null); triggerRef.current?.focus({ preventScroll: true }); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      {item && <div className={styles.panel}>
        <div className={styles.heading}><p id="cart-confirmation-title">{item.alreadyInCart ? "Already in your cart." : "Added to your cart."}</p><button className={styles.close} type="button" onClick={close} aria-label="Close cart confirmation">×</button></div>
        {item.warning && <p className={styles.warning} role="status">{item.warning}</p>}
        <div className={styles.item}>
          {item.image && <div className={styles.image}><Image src={item.image.url} alt={item.image.altText || item.title} fill sizes="96px" /></div>}
          <div className={styles.details}><p className={styles.title}>{item.title}</p>{item.options && <p>{item.options}</p>}<p>Quantity {item.quantity}</p><p className={styles.price}>{formatMoney(item.price)}</p></div>
        </div>
        <Link href="/cart#top" className={styles.primary} onClick={() => {
          close();
          if (window.location.pathname === "/cart") window.scrollTo({ top: 0, behavior: "instant" });
        }}>View cart</Link>
        <button type="button" className={styles.secondary} onClick={close}>Continue exploring</button>
      </div>}
    </dialog>
  </CartConfirmationContext.Provider>;
}
