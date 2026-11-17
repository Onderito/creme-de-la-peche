"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { changeCartSafely } from "@/app/actions/cart-client-action";
import { formatMoney } from "@/lib/shopify/format-money";
import { productPath } from "@/lib/shopify/product-path";
import { visibleVariantOptions, variantOptionsLabel } from "@/lib/shopify/variant-labels";
import type { PublicCart } from "@/lib/shopify/types/cart-types";
import styles from "./cart.module.css";

export function CartContents({ cart, notice }: { cart: PublicCart | null; notice?: string }) {
  const [state, action, pending] = useActionState(changeCartSafely, { message: "" });
  const lines = cart?.lines ?? [];

  return (
    <section className={styles.selection} aria-labelledby="cart-title" aria-busy={pending}>
      <div className={styles.heading}>
        <h1 id="cart-title">Your cart.<sup>{cart?.totalQuantity ?? 0}</sup></h1>
        <Link className={styles.textLink} href="/#collections">Continue exploring</Link>
      </div>
      <p className={styles.feedback} role="status">{state.message || notice}</p>

      {lines.length && cart ? (
        <div className={styles.cartGrid}>
          <fieldset className={styles.items} disabled={pending}>
            <legend className={styles.srOnly}>Your selected pieces</legend>
            <div className={styles.tableHeading}><span>Piece</span><span>Total</span></div>
            {lines.map((line) => {
              const variant = line.merchandise;
              const product = variant.product;
              const rule = variant.quantityRule;
              const selectedOptions = visibleVariantOptions(variant.selectedOptions, product.options);
              const image = variant.image;
              const imageUrl = image ? new URL(image.url) : null;
              imageUrl?.searchParams.set("format", "webp");
              const url = productPath(product.handle);
              return (
                <article key={line.id} className={styles.line}>
                  <Link className={styles.lineImage} href={url} tabIndex={-1} aria-hidden="true">
                    {imageUrl ? <Image src={imageUrl.toString()} alt={image?.altText || product.title} fill sizes="(max-width: 700px) 96px, 140px" /> : <span>No image</span>}
                  </Link>
                  <div className={styles.lineDetails}>
                    <Link className={styles.productTitle} href={url}>{product.title}</Link>
                    {selectedOptions.length ? <p className={styles.variant}>{variantOptionsLabel(selectedOptions)}</p> : null}
                    <p className={styles.unitPrice}>{formatMoney(line.cost.amountPerQuantity)} each</p>
                    <div className={styles.lineControls}>
                      {line.isOriginal ? <p className={styles.uniqueNote}>One of one · Quantity {line.quantity}</p> : <form action={action} className={styles.quantity} aria-label={`Quantity for ${product.title}`}>
                        <input type="hidden" name="operation" value="update" />
                        <input type="hidden" name="lineId" value={line.id} />
                        <button name="quantity" value={line.quantity - rule.increment} disabled={!line.instructions.canUpdateQuantity || line.quantity - rule.increment < rule.minimum} aria-label={`Decrease quantity of ${product.title}`}>−</button>
                        <output aria-live="polite" aria-label={`Quantity of ${product.title}`}>{line.quantity}</output>
                        <button name="quantity" value={line.quantity + rule.increment} disabled={!line.instructions.canUpdateQuantity || (rule.maximum !== null && line.quantity + rule.increment > rule.maximum)} aria-label={`Increase quantity of ${product.title}`}>+</button>
                      </form>}
                      <form action={action}>
                        <input type="hidden" name="operation" value="remove" />
                        <input type="hidden" name="lineId" value={line.id} />
                        <button className={styles.remove} disabled={!line.instructions.canRemove} aria-label={`Remove ${product.title}`}>Remove</button>
                      </form>
                    </div>
                  </div>
                  <p className={styles.lineTotal}>{formatMoney(line.cost.totalAmount)}</p>
                </article>
              );
            })}
          </fieldset>
          <aside className={styles.summary} aria-labelledby="summary-title">
            <h2 id="summary-title">Your selection.</h2>
            <div className={styles.summaryRow}><span>Subtotal</span><span>{formatMoney(cart.cost.subtotalAmount)}</span></div>
            <p className={styles.checkoutNote}>Shipping, taxes and any discounts are calculated at checkout.</p>
            <div className={styles.estimatedTotal}><span>Estimated total</span><span>{formatMoney(cart.cost.totalAmount)}</span></div>
            <form action="/api/checkout" method="post">
              <button className={styles.checkoutButton} disabled={pending}>Checkout</button>
            </form>
            <p className={styles.secureNote}>Secure checkout with Shopify.</p>
          </aside>
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>Your cart is empty.</h2>
          <p>Explore my drawings, prints and pieces to wear.</p>
          <Link className={styles.emptyButton} href="/#collections">Explore my collections</Link>
        </div>
      )}
    </section>
  );
}
