import Link from "next/link";
import { StoreHeader } from "@/app/components/store-header";
import { pageMetadata, siteName, siteUrl } from "@/lib/seo";
import { getLegalLinks } from "@/lib/shopify/policy-service";
import styles from "../policies/[handle]/policy.module.css";

export const metadata = pageMetadata({ title: "Legal notice", description: `Legal notice for ${siteName}.`, path: "/legal-notice" });

/**
 * French legal notice (LCEN art. 6 & Code de la consommation).
 * TODO: replace every "[To be completed]" value before going live.
 */
const publisher = {
  name: "Charlotte Steenhuis",
  status: "[To be completed: e.g. Entrepreneur individuel / micro-entreprise]",
  address: "[To be completed: business address]",
  email: "charlottesteenhuis@hotmail.com",
  phone: "[To be completed]",
  siret: "[To be completed: SIRET number]",
  vat: "[To be completed: VAT number, or “VAT not applicable, art. 293 B of the French CGI”]",
};

const mediator = {
  name: "[To be completed: consumer mediator name]",
  website: "[To be completed: mediator website]",
};

export default async function LegalNoticePage() {
  const legalLinks = await getLegalLinks();
  return <div id="top">
    <StoreHeader />
    <main className={styles.main}>
      <article>
        <p className={styles.eyebrow}>Crème de la pêche / Information</p>
        <h1>Legal notice</h1>
        <div className={styles.copy}>
          <h2>Publisher</h2>
          <p>
            The website {new URL(siteUrl).host} is published by {publisher.name}, {publisher.status}.<br />
            Address: {publisher.address}<br />
            Email: <a href={`mailto:${publisher.email}`}>{publisher.email}</a><br />
            Phone: {publisher.phone}<br />
            SIRET: {publisher.siret}<br />
            VAT: {publisher.vat}
          </p>
          <p>Publication director: {publisher.name}.</p>

          <h2>Hosting</h2>
          <p>
            This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States —{" "}
            <a href="https://vercel.com">vercel.com</a>.
          </p>
          <p>
            Online shop, payments and customer accounts are provided by Shopify International Limited,
            Victoria Buildings, 1–2 Haddington Road, Dublin 4, D04 XN32, Ireland — <a href="https://www.shopify.com">shopify.com</a>.
          </p>

          <h2>Intellectual property</h2>
          <p>
            All drawings, artworks, photographs and texts on this website are the property of {publisher.name}, unless
            stated otherwise. Any reproduction, representation or use, in whole or in part, without prior written
            permission is prohibited.
          </p>

          <h2>Personal data</h2>
          <p>
            Information about how personal data and cookies are handled is available in the{" "}
            <Link href="/policies/privacy-policy">privacy policy</Link>.
          </p>

          <h2>Consumer mediation</h2>
          <p>
            In accordance with articles L.612-1 et seq. of the French Consumer Code, you may contact the following
            consumer mediator free of charge to resolve a dispute that could not be settled directly with us:{" "}
            {mediator.name} — {mediator.website}.
          </p>
        </div>
        <nav className={styles.links} aria-label="Shop policies">
          {legalLinks.map(({ href, label }) => <Link href={href} key={href} aria-current={href === "/legal-notice" ? "page" : undefined}>{label}</Link>)}
        </nav>
      </article>
    </main>
  </div>;
}
