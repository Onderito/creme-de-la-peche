"use client";

import type { ReactNode } from "react";
import { useSectionMotion } from "./section-motion";
import { chapterTimeline, liftTitle, revealChapterCopy, unveilPhoto } from "./charlotte-chapter";
import styles from "../components/meet-charlotte.module.css";

function animateFirstLines(section: HTMLElement) {
  const title = section.querySelector("h3");
  const drawing = section.querySelector(`.${styles.drawingImage}`);
  if (!title || !drawing) return;

  const opening = chapterTimeline(title);
  unveilPhoto(opening, drawing, 0);
  liftTitle(opening, title, 0.28);
  revealChapterCopy(section);
}

export function FirstLinesMotion({ children }: { children: ReactNode }) {
  const scope = useSectionMotion(animateFirstLines);
  return <section ref={scope} className={`${styles.chapter} ${styles.firstLines}`} aria-labelledby="first-lines-title">{children}</section>;
}
