"use client";

import type { ReactNode } from "react";
import { useSectionMotion } from "./section-motion";
import { chapterTimeline, liftTitle, revealChapterCopy, unveilPhoto } from "./charlotte-chapter";
import styles from "../components/meet-charlotte.module.css";

function animatePlace(section: HTMLElement) {
  const title = section.querySelector("h3");
  const studio = section.querySelector(`.${styles.galleryImage}`);
  if (!title || !studio) return;

  const opening = chapterTimeline(title);
  liftTitle(opening, title, 0);
  unveilPhoto(opening, studio, 0.25);
  revealChapterCopy(section);
}

export function PlaceMotion({ children }: { children: ReactNode }) {
  const scope = useSectionMotion(animatePlace);
  return <section ref={scope} className={`${styles.chapter} ${styles.place}`} aria-labelledby="place-title">{children}</section>;
}
