import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { StoreHeader } from "@/app/components/store-header";
import { getProduct } from "@/lib/shopify/catalog/product-service";
import { getOriginalArtworkHandles } from "@/lib/shopify/catalog/original-artworks";
import { productContent } from "@/lib/shopify/catalog/product-content";
import { getProductSuggestions } from "@/lib/shopify/catalog/product-suggestions";
import { formatMoney } from "@/lib/shopify/format-money";
import { productPath } from "@/lib/shopify/product-path";
import { ProductDetail } from "./product-detail";
import styles from "./product.module.css";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct({ handle });
  if (!product) return { title: "Piece not found — Crème de la pêche" };
  return {
    title: `${product.seo.title || product.title} — Crème de la pêche`,
    description: product.seo.description || product.description.slice(0, 160),
    openGraph: { title: product.title, images: product.featuredImage ? [product.featuredImage.url] : [] },
  };
}

async function Suggestions({ productId }: { productId: string }) {
  await connection();
  let products;
  try { products = await getProductSuggestions(productId); } catch { return null; }
  if (!products.length) return null;
  return <section className={styles.suggestions} aria-labelledby="suggestions-title">
    <header><h2 id="suggestions-title">Something else might catch your eye.</h2><p>A few more pieces from my world.</p></header>
    <div className={styles.suggestionGrid}>
      {products.map((product) => {
        const image = new URL(product.featuredImage!.url);
        image.searchParams.set("format", "webp");
        return <Link className={styles.suggestionCard} key={product.id} href={productPath(product.handle)} prefetch={false}>
          <div className={styles.suggestionImage}><Image src={image.toString()} alt={product.featuredImage!.altText || product.title} fill sizes="(max-width: 700px) 50vw, 25vw" /></div>
          <div><h3>{product.title}</h3><span>{Number(product.priceRange.maxVariantPrice.amount) > Number(product.priceRange.minVariantPrice.amount) ? "From " : ""}{formatMoney(product.priceRange.minVariantPrice)}</span></div>
        </Link>;
      })}
    </div>
  </section>;
}

async function Content({ params }: Props) {
  const { handle } = await params;
  const [product, originals] = await Promise.all([getProduct({ handle }), getOriginalArtworkHandles()]);
  if (!product) notFound();
  const content = productContent(product.descriptionHtml);
  const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];
  return <>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/#collections">Collections</Link><span aria-hidden="true">/</span><span aria-current="page">{product.title}</span></nav>
    <ProductDetail key={product.id} product={{ handle: product.handle, title: product.title, productType: product.productType, options: product.options, variants: product.variants, images, isOriginal: originals.includes(handle) }}>
      <div className={styles.details}>
        <details open>
          <summary>About this piece<span aria-hidden="true">+</span></summary>
          {content.description ? <div className={styles.description} dangerouslySetInnerHTML={{ __html: content.description }} /> : <p className={styles.description}>{product.description || "Have a question about this piece? Get in touch below."}</p>}
        </details>
        {content.measurements ? <details><summary>Size guide<span aria-hidden="true">+</span></summary><div className={`${styles.description} ${styles.measurements}`} tabIndex={0} role="region" aria-label="Size measurements" dangerouslySetInnerHTML={{ __html: content.measurements }} /></details> : null}
        <details><summary>Shipping &amp; returns<span aria-hidden="true">+</span></summary><div className={styles.description}><p>Delivery options and costs are shown at checkout, based on your address.</p><p>For return conditions, see my <a href="https://cremedelapeche.shop/policies/refund-policy">returns &amp; exchanges policy</a>.</p></div></details>
      </div>
      <a className={styles.question} href="mailto:charlottesteenhuis@hotmail.com">A question about this piece? Get in touch</a>
    </ProductDetail>
    <Suspense fallback={null}><Suggestions productId={product.id} /></Suspense>
  </>;
}

export default function ProductPage({ params }: Props) {
  return <div id="top">
    <a className="skip-link" href="#product-main">Skip to product</a>
    <StoreHeader />
    <main id="product-main" className={styles.main}>
      <Suspense fallback={<p className={styles.loading} role="status">Loading this piece…</p>}><Content params={params} /></Suspense>
    </main>
  </div>;
}
