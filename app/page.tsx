import { Suspense } from "react";
import { ProductShowcase } from "./components/product-showcase";
import { MeetCharlotte } from "./components/meet-charlotte";
import { SiteHeader } from "./components/site-header";
import { Faq } from "./components/faq";

const studioDetails = [
  { value: "Original", label: "Drawings by hand" },
  { value: "Wearable", label: "Art for your everyday" },
  { label: "Signed by me" },
  { label: "Carefully packed,", secondLine: "shipped from France" },
];

export default function Home() {
  return (
    <main id="top">
      <a className="skip-link" href="#studio">Skip to the studio</a>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-panel">
          <SiteHeader />

          <div className="hero-copy">
            <h1 id="hero-title">
              <span>Art to wear.</span>
              <span>Art to keep.</span>
            </h1>
            <p className="hero-description">
              My drawings. On paper, on prints, on you.
              <br />
              Feminine, sensual, a little bold.
            </p>
            <a className="collection-button" href="#collections">
              Explore my collections
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16 16 4M5 4h11v11" />
              </svg>
            </a>
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
            <image href="/charlotte-artwork-reference.png" width="892" height="914" />
          </svg>
        </div>
      </section>

      <section className="studio" aria-label="My studio">
        <div className="studio-story" id="studio">
          <p>
            I draw women the way I see them. Soft, bold, and entirely at ease.
            Everything starts with a line, drawn by hand. Some drawings find a
            place on your wall. Others become the tee or sweatshirt you live in.
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
      </section>

      <section className="collections" id="collections" aria-labelledby="collections-title">
        <header className="collections-intro">
          <h2 id="collections-title">Pieces of my world.</h2>
          <p>
            My originals on paper, a little pink, and drawings you can wear.
            Find a piece of my world to make your own.
          </p>
        </header>
        <Suspense fallback={<p className="catalog-message" role="status">Loading the collections…</p>}>
          <ProductShowcase />
        </Suspense>
      </section>
      <MeetCharlotte />
      <Faq />
    </main>
  );
}
