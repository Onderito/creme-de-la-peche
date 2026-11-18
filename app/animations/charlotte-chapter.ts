import { gsap } from "gsap";
import styles from "../components/meet-charlotte.module.css";

export function chapterTimeline(trigger: Element, start = "top 72%") {
  return gsap.timeline({
    scrollTrigger: { trigger, start, once: true },
    defaults: { ease: "power3.out" },
  });
}

export function liftTitle(timeline: gsap.core.Timeline, title: Element, at: number) {
  timeline.from(title.querySelectorAll(`.${styles.chapterLine}`), {
    yPercent: 150,
    duration: 0.95,
    stagger: 0.12,
  }, at);
}

export function unveilPhoto(timeline: gsap.core.Timeline, photo: Element, at: number) {
  timeline.fromTo(photo, { clipPath: "inset(100% 0% 0% 0%)" }, {
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 1.05,
    ease: "power2.inOut",
    clearProps: "clipPath",
  }, at);
}

export function revealChapterCopy(section: HTMLElement) {
  const copy = section.querySelector(`.${styles.copy}`);
  if (!copy) return;
  chapterTimeline(copy, "top 72%").from(copy.children, {
    opacity: 0,
    y: 12,
    duration: 0.72,
    stagger: 0.14,
  }, 0.32);
}
