"use client";

import type { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionMotion } from "./section-motion";
import styles from "../components/site-footer.module.css";

function animateFooter(footer: HTMLElement) {
  const tagline = footer.querySelector(`.${styles.tagline}`);
  const brand = footer.querySelector(`.${styles.brand}`);
  if (!tagline || !brand) return;

  gsap.from(tagline.children, {
    opacity: 0, y: 16, duration: 0.72, stagger: 0.09, ease: "power3.out",
    scrollTrigger: { trigger: tagline, start: "clamp(top 82%)", once: true },
  });

  footer.querySelectorAll(`.${styles.navigation}`).forEach((nav) => {
    gsap.from(nav.querySelectorAll("h2, li"), {
      opacity: 0, y: 8, duration: 0.5, stagger: 0.055, delay: 0.15,
      scrollTrigger: { trigger: nav, start: "clamp(top 82%)", once: true },
    });
  });

  gsap.from(brand.querySelectorAll(`.${styles.brandMask} > span`), {
    yPercent: 125, duration: 0.9, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: brand, start: "clamp(top 88%)", once: true },
  });

  // The shared footer moves as routes stream in and FAQ answers expand.
  let refreshTimer: ReturnType<typeof setTimeout>;
  const observer = new ResizeObserver(() => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);
  });
  observer.observe(document.body);
  return () => {
    clearTimeout(refreshTimer);
    observer.disconnect();
  };
}

export function FooterMotion({ children }: { children: ReactNode }) {
  const scope = useSectionMotion(animateFooter);
  return <footer ref={scope} id="footer" className={styles.footer}>{children}</footer>;
}
