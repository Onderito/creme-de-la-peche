"use client";

import type { ReactNode } from "react";
import { useSectionMotion } from "./section-motion";
import { chapterTimeline, liftTitle } from "./charlotte-chapter";
import styles from "../components/meet-charlotte.module.css";

function animatePaperFirst(section: HTMLElement) {
  const title = section.querySelector("h3");
  const link = section.querySelector("a");
  if (!title || !link) return;

  const timeline = chapterTimeline(title, "top 65%");
  liftTitle(timeline, title, 0);
  timeline
    .from(section.querySelectorAll("p > span"), {
      y: 12, opacity: 0, duration: 0.65, stagger: 0.09,
    }, 0.36)
    .from(link, { opacity: 0, duration: 0.55 }, 0.63);
}

export function PaperFirstMotion({ children }: { children: ReactNode }) {
  const scope = useSectionMotion(animatePaperFirst);
  return <section ref={scope} id="paper-first" className={styles.paperPause} aria-labelledby="paper-first-title">{children}</section>;
}
