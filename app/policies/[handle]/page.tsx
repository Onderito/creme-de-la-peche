import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StoreHeader } from "@/app/components/store-header";
import { pageMetadata, siteName } from "@/lib/seo";
import { isPolicyHandle, policies, policyLinks } from "@/lib/shopify/policies";
import { getPolicy } from "@/lib/shopify/policy-service";
import { CART_COOKIE_DAYS, CART_COOKIE_NAME } from "@/lib/shopify/cart/cart-cookie-policy";
import styles from "./policy.module.css";

type Props = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return Object.keys(policies).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  if (!isPolicyHandle(handle)) return { title: "Page not found", robots: { index: false, follow: true } };
  return pageMetadata({ title: policies[handle].label, description: `${policies[handle].label} for ${siteName}.`, path: `/policies/${handle}` });
}

async function Policy({ params }: Props) {
  const { handle } = await params;
  if (!isPolicyHandle(handle)) notFound();
  const policy = await getPolicy(handle);
  if (!policy) notFound();
  return <article>
    <p className={styles.eyebrow}>Crème de la pêche / Information</p>
    <h1>{policy.title}</h1>
    <div className={styles.copy} dangerouslySetInnerHTML={{ __html: policy.body }} />
    {handle === "privacy-policy" && <section className={styles.copy} aria-labelledby="storefront-cookies-title">
      <h2 id="storefront-cookies-title">Cookies on this storefront</h2>
      <p>This storefront uses a cookie named <code>{CART_COOKIE_NAME}</code> to remember your Shopify shopping cart and retrieve your selection when you return. It stores a cart identifier and is kept for up to {CART_COOKIE_DAYS} days after it is set or updated.</p>
      <p>This cookie is necessary to provide the shopping cart you request. It is not used for advertising or audience measurement. It is protected with HttpOnly and SameSite=Lax, and is sent over secure connections on the live site.</p>
      <p>Shopify may use additional cookies on its hosted checkout and customer account pages. You can delete this storefront’s cart cookie through your browser settings; doing so removes this browser’s link to your saved cart.</p>
    </section>}
    <nav className={styles.links} aria-label="Shop policies">
      {policyLinks.map(({ href, label }) => <Link href={href} key={href} aria-current={href === `/policies/${handle}` ? "page" : undefined}>{label}</Link>)}
    </nav>
  </article>;
}

export default function PolicyPage({ params }: Props) {
  return <div id="top">
    <StoreHeader />
    <main className={styles.main}>
      <Suspense fallback={<p role="status">Loading policy…</p>}><Policy params={params} /></Suspense>
    </main>
  </div>;
}
