"use client";

import Image from "next/image";
import { useActionState, useId, useRef, useState, type ReactNode } from "react";
import { useCartConfirmation } from "@/app/components/cart-confirmation";
import { cartSubmitter, changeCartSafely } from "@/app/actions/cart-client-action";
import { formatMoney } from "@/lib/shopify/format-money";
import { artworkFormat } from "@/lib/shopify/variant-labels";
import type { ProductVariant } from "@/lib/shopify/types/product-types";
import type { ShopifyImage } from "@/lib/shopify/types/storefront-types";
import styles from "./product.module.css";

type ProductData = {
  handle: string; title: string; productType: string;
  isOriginal: boolean;
  images: ShopifyImage[]; variants: ProductVariant[];
  options: { name: string; values: string[] }[];
};

function imageSource(url: string) {
  const source = new URL(url);
  source.searchParams.set("format", "webp");
  return source.toString();
}

export function ProductDetail({ product, children }: { product: ProductData; children: ReactNode }) {
  const initial = product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const [selectedId, setSelectedId] = useState(initial?.id);
  const selected = product.variants.find((variant) => variant.id === selectedId) ?? initial;
  const [activeImage, setActiveImage] = useState(initial?.image ?? product.images[0]);
  const [quantity, setQuantity] = useState(String(initial?.quantityRule.minimum ?? 1));
  const showConfirmation = useCartConfirmation();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [state, action, pending] = useActionState(async (previous: Parameters<typeof changeCartSafely>[0], form: FormData) => {
    const trigger = triggerRef.current;
    const result = await changeCartSafely(previous, form);
    if (result.confirmation) showConfirmation(result.confirmation, trigger);
    return result;
  }, { message: "" });
  const options = product.options.filter((option) => option.values.length > 1);
  const formats = product.options.flatMap((option) => {
    const format = artworkFormat(option);
    return format ? [format] : [];
  });
  const quantityId = useId();
  const amount = product.isOriginal ? 1 : Number(quantity);
  const rule = selected?.quantityRule;
  const valid = rule && Number.isInteger(amount) && amount >= rule.minimum && amount % rule.increment === 0 && (rule.maximum === null || amount <= rule.maximum);

  function choose(name: string, value: string) {
    const candidates = product.variants.filter((variant) => variant.availableForSale && variant.selectedOptions.some((option) => option.name === name && option.value === value));
    const variant = candidates.find((variant) => variant.selectedOptions.every((option) => option.name === name || selected?.selectedOptions.some((current) => current.name === option.name && current.value === option.value))) ?? candidates[0];
    if (!variant) return;
    setSelectedId(variant.id);
    setQuantity(String(variant.quantityRule.minimum));
    if (variant.image) setActiveImage(variant.image);
  }

  return (
    <article className={styles.product}>
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          {activeImage ? <Image key={activeImage.url} src={imageSource(activeImage.url)} alt={activeImage.altText || product.title} fill sizes="(max-width: 700px) 100vw, 57vw" loading="eager" fetchPriority="high" /> : <p>Image unavailable</p>}
        </div>
        {product.images.length > 1 ? <div className={styles.thumbnails} role="group" aria-label="Product photos">
          {product.images.map((image, index) => <button key={image.url} type="button" aria-label={`View photo ${index + 1} of ${product.title}`} aria-pressed={activeImage?.url === image.url} onClick={() => setActiveImage(image)}>
            <Image src={imageSource(image.url)} alt="" fill sizes="72px" />
          </button>)}
        </div> : null}
      </div>

      <div className={styles.information}>
        <p className={styles.eyebrow}>{product.productType === "Print Material" ? "Art print" : product.productType || "Crème de la pêche"}</p>
        <h1>{product.title}</h1>
        {selected ? <div className={styles.price} aria-live="polite">
          <span>{formatMoney(selected.price)}</span>
          {selected.compareAtPrice && Number(selected.compareAtPrice.amount) > Number(selected.price.amount) ? <del>{formatMoney(selected.compareAtPrice)}</del> : null}
        </div> : null}

        {formats.length ? <dl className={styles.format}>{formats.map((format) => <div key={format}><dt>Format</dt><dd>{format}</dd></div>)}</dl> : null}

        <form action={action} onSubmitCapture={(event) => { triggerRef.current = cartSubmitter(event); }} className={styles.purchase} aria-label={`Add ${product.title} to cart`}>
          <input type="hidden" name="operation" value="add" />
          <input type="hidden" name="handle" value={product.handle} />
          <input type="hidden" name="variantId" value={selected?.id ?? ""} />

          <fieldset className={styles.purchaseFields} disabled={pending}>
            <legend className={styles.srOnly}>Choose your piece</legend>
            {options.map((option, optionIndex) => <fieldset className={styles.optionGroup} key={option.name}>
              <legend>{option.name.charAt(0).toUpperCase() + option.name.slice(1)}<span>{selected?.selectedOptions.find((item) => item.name === option.name)?.value}</span></legend>
              <div className={styles.options}>
                {option.values.map((value) => {
                  const available = product.variants.some((variant) => variant.availableForSale && variant.selectedOptions.some((item) => item.name === option.name && item.value === value) && options.slice(0, optionIndex).every((previous) => variant.selectedOptions.some((item) => item.name === previous.name && item.value === selected?.selectedOptions.find((current) => current.name === previous.name)?.value)));
                  const chosen = selected?.selectedOptions.some((item) => item.name === option.name && item.value === value);
                  return <button key={value} type="button" aria-pressed={chosen} disabled={!available} onClick={() => choose(option.name, value)}>{value}{!available ? <span className={styles.srOnly}> — unavailable</span> : null}</button>;
                })}
              </div>
            </fieldset>)}
            {product.isOriginal ? <><input type="hidden" name="quantity" value="1" /><p className={styles.uniqueNote}>Original artwork · One of one.</p></> : selected?.availableForSale && rule ? <div className={styles.quantityRow}>
              <label htmlFor={quantityId}>Quantity</label>
              <div className={styles.quantity}>
                <button type="button" aria-label="Decrease quantity" disabled={amount - rule.increment < rule.minimum || !valid} onClick={() => setQuantity(String(amount - rule.increment))}>−</button>
                <input id={quantityId} name="quantity" type="number" inputMode="numeric" min={rule.minimum} max={rule.maximum ?? undefined} step={rule.increment} value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
                <button type="button" aria-label="Increase quantity" disabled={!valid || (rule.maximum !== null && amount + rule.increment > rule.maximum)} onClick={() => setQuantity(String(amount + rule.increment))}>+</button>
              </div>
            </div> : null}
            <button className={styles.addButton} type="submit" disabled={!selected?.availableForSale || !valid}>
              {pending ? "Adding…" : selected?.availableForSale ? "Add to cart" : "Sold out"}
            </button>
          </fieldset>
          <p className={styles.feedback} role="status">{state.error ? state.message : ""}</p>
          <p className={styles.shippingNote}>{selected?.availableForSale ? "Shipping and any applicable taxes are calculated at checkout." : "This piece is currently unavailable."}</p>
        </form>
        {children}
      </div>
    </article>
  );
}
