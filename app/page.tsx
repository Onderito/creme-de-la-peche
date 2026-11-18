import { Suspense } from "react";
import { ProductShowcase } from "./components/product-showcase";
import { MeetCharlotte } from "./components/meet-charlotte";
import { SiteHeader } from "./components/site-header";
import { CartCount } from "./components/cart-count";
import { Faq } from "./components/faq";
import { StudioMotion } from "./animations/studio-motion";
import { CollectionsIntroMotion } from "./animations/collections-motion";
import { HomeMotion } from "./components/home-motion";
import { JsonLd } from "./components/json-ld";
import { absoluteUrl, pageMetadata, siteDescription, siteName, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Original drawings, prints & clothing", description: siteDescription, path: "/" });

const studioDetails = [
  { value: "Original", label: "Drawn by hand" },
  { value: "Wearable", label: "Art for your everyday" },
  { label: "Originals signed by me" },
  { label: "Carefully packed,", secondLine: "shipped from France" },
];

export default function Home() {
  return (
    <HomeMotion>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteName, url: siteUrl, inLanguage: "en" },
        { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName, url: siteUrl, logo: absoluteUrl("/images/brand/logo-beige.png") },
      ] }} />
      <a className="skip-link" href="#studio">Skip to the studio</a>
      <SiteHeader home cartCount={<Suspense fallback={null}><CartCount /></Suspense>} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-panel">

          <div className="hero-copy">
            <h1 id="hero-title">
              <span className="hero-line-mask"><span className="hero-line">Art to wear.</span></span>{" "}
              <span className="hero-line-mask"><span className="hero-line">Art to keep.</span></span>
            </h1>
            <p className="hero-description">
              <span className="hero-line-mask"><span className="hero-line">My drawings, from paper to prints and pieces you can wear.</span></span>
              <span className="hero-line-mask"><span className="hero-line">Feminine, sensual, a little bold.</span></span>
            </p>
            <div className="hero-button-mask"><a className="collection-button" href="#collections">
              Explore my collections
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16 16 4M5 4h11v11" />
              </svg>
            </a></div>
          </div>
        </div>

        {/* Isolate the supplied portrait without stretching the illustration.
            Replace the reference with the original artwork when available. */}
        <div className="hero-artwork">
          <svg
            className="artwork"
            viewBox="453 83 383 501"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-labelledby="artwork-title"
          >
            <title id="artwork-title">
              Hand-drawn graphite portrait of a woman applying mascara, wearing a statement necklace
            </title>
            <image href="/charlotte-artwork-reference.webp" width="892" height="914" />
          </svg>
        </div>
      </section>

      <StudioMotion>
        <div className="studio-story" id="studio">
          <p>
            I’ve always drawn women. Their faces, their expressions, the details
            that make them who they are. My drawings find their way onto paper,
            prints, tees and sweatshirts.
          </p>
        </div>
        <ul className="studio-details" aria-label="From my studio">
          {studioDetails.map((detail, index) => (
            <li key={index}>
              {detail.value && <span className="detail-value">{detail.value}</span>}
              <span className="detail-label">
                {detail.label}
                {detail.secondLine && <><br />{detail.secondLine}</>}
              </span>
            </li>
          ))}
        </ul>
      </StudioMotion>

      <section className="collections" id="collections" aria-labelledby="collections-title">
        <CollectionsIntroMotion>
          <h2 id="collections-title">Pieces of my world.</h2>
          <p>
            Original drawings, art prints and pieces made to wear.
            Find the one that feels like you.
          </p>
        </CollectionsIntroMotion>
        <Suspense fallback={<p className="catalog-message" role="status">Loading the collections…</p>}>
          <ProductShowcase />
        </Suspense>
      </section>
      <MeetCharlotte />
      <Faq />
    </HomeMotion>
  );
}
