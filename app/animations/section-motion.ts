"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function useSectionMotion(animate: (section: HTMLElement) => void | (() => void)) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = scope.current;
    if (!section) return;

    const media = gsap.matchMedia(section);
    // Next restores the route's visibility and scroll position during the commit.
    // Measure on the next frame, once all the sections have their final layout.
    const frame = requestAnimationFrame(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => animate(section));
    });
    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, { scope, dependencies: [animate], revertOnUpdate: true });

  return scope;
}

export function revealLines(text: HTMLElement) {
  SplitText.create(text, {
    type: "lines",
    mask: "lines",
    tag: "span",
    linesClass: "scroll-line",
    autoSplit: true,
    onSplit: (split) => gsap.from(split.lines, {
      yPercent: 105,
      duration: 0.78,
      stagger: 0.09,
      ease: "power3.out",
      scrollTrigger: { trigger: text, start: "top 90%", once: true },
      onComplete: () => split.revert(),
    }),
  });
}
