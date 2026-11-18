"use client";

import { gsap } from "gsap";
import { useSectionMotion } from "./section-motion";
import styles from "../components/meet-charlotte.module.css";

function animateCharlotteIntro(header: HTMLElement) {
  const title = header.querySelector("h2");
  const subtitle = header.querySelector("p");
  if (!title || !subtitle) return;

  const timeline = gsap.timeline({
    scrollTrigger: { trigger: title, start: "top 65%", once: true },
    defaults: { ease: "power3.out" },
  });

  timeline
    .from(title.querySelectorAll(`.${styles.introLine}`), {
      yPercent: 150,
      duration: 0.95,
      stagger: 0.12,
    })
    .from(subtitle, { y: 12, opacity: 0, duration: 0.65 }, 0.36);
}

export function CharlotteIntroMotion() {
  const scope = useSectionMotion(animateCharlotteIntro);

  return (
    <header ref={scope} className={styles.intro}>
      <h2 id="charlotte-title" className={styles.introTitle}>
        <span className={styles.introLineMask}><span className={styles.introLine}>From my hands</span></span>{" "}
        <span className={styles.introLineMask}><span className={styles.introLine}>to yours.</span></span>
      </h2>
      <p className={styles.introSubtitle}>Artist &amp; tattooist</p>
    </header>
  );
}
