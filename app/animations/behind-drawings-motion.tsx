"use client";

import type { ReactNode } from "react";
import { useSectionMotion } from "./section-motion";
import { chapterTimeline, liftTitle, revealChapterCopy, unveilPhoto } from "./charlotte-chapter";
import styles from "../components/meet-charlotte.module.css";

function animateBehindDrawings(section: HTMLElement) {
  const title = section.querySelector("h3");
  const portrait = section.querySelector(`.${styles.portraitImage}`);
  const detail = section.querySelector(`.${styles.wallImage}`);
  const signature = section.querySelector(`.${styles.signature}`);
  if (!title || !portrait || !detail || !signature) return;

  const opening = chapterTimeline(title);
  liftTitle(opening, title, 0);
  unveilPhoto(opening, portrait, 0.22);

  const closeUp = chapterTimeline(detail);
  unveilPhoto(closeUp, detail, 0);
  closeUp.fromTo(signature, { clipPath: "inset(0% 100% 0% 0%)" }, {
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 0.7,
    clearProps: "clipPath",
  }, 0.42);

  revealChapterCopy(section);
}

export function BehindDrawingsMotion({ children }: { children: ReactNode }) {
  const scope = useSectionMotion(animateBehindDrawings);
  return <section ref={scope} className={styles.chapter} aria-labelledby="behind-drawings-title">{children}</section>;
}
