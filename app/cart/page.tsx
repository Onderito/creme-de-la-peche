import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { StoreHeader } from "../components/store-header";
import { AddToCart } from "../components/add-to-cart";
import { getCart, publicCart } from "@/lib/shopify/cart/cart-service";
import { readCartId } from "@/lib/shopify/cart/cart-cookie";
import { getProduct } from "@/lib/shopify/catalog/product-service";
import { getCollectionProducts } from "@/lib/shopify/catalog/collection-service";
import { getOriginalArtworkHandles } from "@/lib/shopify/catalog/original-artworks";
import { formatMoney } from "@/lib/shopify/format-money";
import { productPath } from "@/lib/shopify/product-path";
import { buyerIp } from "@/lib/shopify/request/buyer-ip";
import { CartContents } from "./cart-contents";
import styles from "./cart.module.css";

export const metadata: Metadata = {
  title: "Your cart — Crème de la pêche",
  robots: { index: false, follow: true },
};

async function Selection({ searchParams }: { searchParams: Promise<{ checkout?: string; notice?: string }> }) {
  const [id, ip, query] = await Promise.all([readCartId(), buyerIp(), searchParams]);
  let cart;
  let originals;
  try {
    [cart, originals] = await Promise.all([getCart(id, ip), getOriginalArtworkHandles()]);
  } catch {
    return <div className={styles.unavailable}><h1>Your cart.</h1><p>Your selection couldn’t be loaded right now.</p><a className={styles.textLink} href="/cart">Try again</a></div>;
  }
  const notice = query.checkout === "unavailable"
    ? "Checkout is temporarily unavailable. Your selection is saved. Please try again."
    : query.checkout === "unique" ? "Original artworks are one of a kind. Remove any extra copies before checking out."
    : query.checkout === "empty" ? "Add a piece to your cart before checking out."
    : query.notice === "adjusted" ? "Your cart has changed. Please check your selection before continuing."
    : id && !cart ? "Your previous cart has expired. Find your next favourite below." : undefined;
  return <CartContents cart={cart ? publicCart(cart, new Set(originals)) : null} notice={notice} />;
}

async function Recommendations() {
  let products;
  try {
    const print = getCollectionProducts({ handle: "prints" }, { first: 1 }).then((collection) => {
      const handle = collection?.products.nodes[0]?.handle;
      return handle ? getProduct({ handle }) : null;
    });
    products = await Promise.all([getProduct({ handle: "black-panther" }), print, getProduct({ handle: "oversized-tee-n-51" })]);
  } catch { return null; }

  return (
    <section className={styles.recommendations} aria-labelledby="discover-title">
      <header className={styles.discoverHeading}><h2 id="discover-title">A little more of my world.</h2><p>On paper. On your wall. On you.</p></header>
      <div className={styles.discoverGrid}>
        {products.map((product) => {
          if (!product?.featuredImage) return null;
          const image = new URL(product.featuredImage.url);
          image.searchParams.set("format", "webp");
          return (
            <article key={product.id} className={styles.discoverCard}>
              <Link href={productPath(product.handle)}>
                <div className={styles.discoverImage}><Image src={image.toString()} alt={product.featuredImage.altText || product.title} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>
                <div className={styles.discoverCaption}><h3>{product.title}</h3><span>{Number(product.priceRange.maxVariantPrice.amount) > Number(product.priceRange.minVariantPrice.amount) ? "From " : ""}{formatMoney(product.priceRange.minVariantPrice)}</span></div>
              </Link>
              {product.availableForSale ? <AddToCart handle={product.handle} title={product.title} variants={product.variants.map(({ id, title, price, availableForSale }) => ({ id, title, price, availableForSale }))} /> : <p className={styles.soldOut}>Sold out</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function CartPage({ searchParams }: { searchParams: Promise<{ checkout?: string; notice?: string }> }) {
  return (
    <div id="top">
      <StoreHeader />
      <main className={`${styles.page} ${styles.main}`} id="cart-main">
        <Suspense fallback={<div className={styles.loading} role="status">Loading your selection…</div>}>
          <Selection searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={null}><Recommendations /></Suspense>
      </main>
    </div>
  );
}
