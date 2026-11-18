"use client";

import { gsap } from "gsap";
import { useSectionMotion } from "./section-motion";
import styles from "../components/faq.module.css";

function animateFaq(section: HTMLElement) {
  const title = section.querySelector("h2");
  if (!title) return;

  gsap.from(title.querySelectorAll(`.${styles.lineMask} > span`), {
    yPercent: 130,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: { trigger: title, start: "top 72%", once: true },
  });

  const questions = section.querySelector(`.${styles.questions}`);
  if (questions) {
    gsap.from(questions.querySelectorAll("h3"), {
      y: 12,
      opacity: 0,
      duration: 0.55,
      ease: "power2.out",
      scrollTrigger: { trigger: questions, start: "top 82%", once: true },
    });
  }
}

export function useFaqMotion() {
  return useSectionMotion(animateFaq);
}
