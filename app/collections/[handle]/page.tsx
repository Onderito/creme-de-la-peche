import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StoreHeader } from "@/app/components/store-header";
import { getCollectionProducts } from "@/lib/shopify/catalog/collection-service";
import { collectConnection } from "@/lib/shopify/catalog/catalog-pagination";
import { collectionPages, collectionLinks, isCollectionHandle } from "@/lib/shopify/collection-pages";
import { productPath } from "@/lib/shopify/product-path";
import { formatMoney } from "@/lib/shopify/format-money";
import styles from "./collection.module.css";

type Props = { params: Promise<{ handle: string }>; searchParams: Promise<{ page?: string | string[] }> };
const PAGE_SIZE = 24;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  if (!isCollectionHandle(handle)) return { title: "Collection not found — Crème de la pêche" };
  return { title: `${collectionPages[handle].title} — Crème de la pêche`, description: collectionPages[handle].description };
}

async function Content({ params, searchParams }: Props) {
  const [{ handle }, query] = await Promise.all([params, searchParams]);
  if (!isCollectionHandle(handle)) notFound();
  const config = collectionPages[handle];
  let products;
  try {
    const first = await getCollectionProducts({ handle }, { first: 100 });
    if (!first) throw new Error("Collection unavailable");
    products = await collectConnection(first.products, async (after) => {
      const next = await getCollectionProducts({ handle }, { first: 100, after });
      if (!next) throw new Error("Collection unavailable during pagination");
      return next.products;
    });
  } catch {
    return <div className={styles.message}><h1>{config.title}.</h1><p>This collection couldn’t be loaded right now.</p><a href={`/collections/${handle}`}>Try again</a></div>;
  }
  const rawPage = typeof query.page === "string" && /^[1-9]\d{0,5}$/.test(query.page) ? Number(query.page) : 1;
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const page = Math.min(rawPage, totalPages);
  const visible = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <>
    <header className={styles.intro}>
      <p className={styles.eyebrow}>Crème de la pêche / Collections</p>
      <h1>{config.title}<span>.</span></h1>
      <p className={styles.description}>{config.description}</p>
    </header>
    <nav className={styles.categories} aria-label="Collections">
      {collectionLinks.map((item) => <Link key={item.href} href={item.href} aria-current={item.href === `/collections/${handle}` ? "page" : undefined}>{item.label}</Link>)}
    </nav>
    <div className={styles.results}><span>{products.length} {products.length === 1 ? "piece" : "pieces"}</span><span>{totalPages > 1 ? `Page ${page} of ${totalPages}` : null}</span></div>
    {visible.length ? <div className={styles.grid}>
      {visible.map((product) => {
        const image = product.featuredImage ? new URL(product.featuredImage.url) : null;
        image?.searchParams.set("format", "webp");
        const range = Number(product.priceRange.maxVariantPrice.amount) > Number(product.priceRange.minVariantPrice.amount);
        return <article key={product.id} className={styles.card}>
          <Link href={productPath(product.handle)}>
            <div className={`${styles.image} ${handle === "shop" ? styles.clothing : ""}`}>
              {image ? <Image src={image.toString()} alt={product.featuredImage?.altText || product.title} fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" /> : <span className={styles.noImage}>Image unavailable</span>}
              {!product.availableForSale && <span className={styles.soldOut}>Sold out</span>}
            </div>
            <div className={styles.caption}><h2>{product.title}</h2><span>{range ? "from " : ""}{formatMoney(product.priceRange.minVariantPrice)}</span></div>
            {handle === "creme-de-la-peche" && <p className={styles.original}>Original, 1 of 1</p>}
          </Link>
        </article>;
      })}
    </div> : <p className={styles.empty}>There are no pieces in this collection just yet.</p>}
    {totalPages > 1 && <nav className={styles.pagination} aria-label="Collection pages">
      {page > 1 && <Link href={page === 2 ? `/collections/${handle}` : `/collections/${handle}?page=${page - 1}`}>Previous</Link>}
      <span>Page {page} of {totalPages}</span>
      {page < totalPages && <Link href={`/collections/${handle}?page=${page + 1}`}>Next</Link>}
    </nav>}
  </>;
}

export default function CollectionPage(props: Props) {
  return <div id="top"><a className="skip-link" href="#collection-main">Skip to collection</a><StoreHeader /><main id="collection-main" className={styles.main}><Suspense fallback={<p className={styles.loading} role="status">Loading the collection…</p>}><Content {...props} /></Suspense></main></div>;
}
