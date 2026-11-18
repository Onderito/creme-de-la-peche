import { FooterMotion } from "../animations/footer-motion";
import styles from "./site-footer.module.css";
import { getLegalLinks } from "@/lib/shopify/policy-service";

const shopUrl = "https://cremedelapeche.shop";
const contactUrl = "mailto:charlottesteenhuis@hotmail.com";

const groups = [
  {
    title: "Shop",
    links: [
      { label: "Original drawings", href: "/collections/creme-de-la-peche" },
      { label: "Prints", href: "/collections/prints" },
      { label: "Clothing", href: "/collections/shop" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "My story", href: "/#charlotte" },
      { label: "FAQ", href: "/#faq" },
      { label: "Account", href: `${shopUrl}/account` },
    ],
  },
];

export async function SiteFooter() {
  const legalLinks = await getLegalLinks();
  return (
    <FooterMotion>
      <div className={styles.top}>
        <div className={styles.intro}>
          <p className={styles.tagline}>
            <span>Original drawings,</span>
            <span>prints &amp; clothing.</span>
          </p>
          <a className={styles.contact} href={contactUrl}>
            Get in touch
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 16 16 4M5 4h11v11" />
            </svg>
          </a>
        </div>

        {groups.map(({ title, links }) => (
          <nav key={title} className={styles.navigation} aria-label={`Footer ${title.toLowerCase()}`}>
            <h2 className={styles.navTitle}>{title}</h2>
            <ul>
              {links.map(({ label, href }) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <a className={styles.brand} href="#top" aria-label="Crème de la pêche — back to top">
        <span className={styles.brandMask}><span>Crème de</span></span>{" "}
        <span className={styles.brandMask}><span>la pêche</span></span>
      </a>

      <div className={styles.bottom}>
        <p>© 2026 Crème de la pêche</p>
        <nav className={styles.policies} aria-label="Shop policies">
          {legalLinks.map(({ href, label }) => <a href={href} key={href}>{label}</a>)}
        </nav>
      </div>
    </FooterMotion>
  );
}
