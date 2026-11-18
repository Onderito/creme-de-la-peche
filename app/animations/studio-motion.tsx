"use client";

import type { ReactNode } from "react";
import { gsap } from "gsap";
import { revealLines, useSectionMotion } from "./section-motion";

function animateStudio(section: HTMLElement) {
  const story = section.querySelector<HTMLElement>(".studio-story p");
  if (story) revealLines(story);

  section.querySelectorAll(".studio-details li").forEach((detail) => {
    gsap.from(detail.children, {
      y: 10,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "power2.out",
      scrollTrigger: { trigger: detail, start: "top 90%", once: true },
    });
  });
}

export function StudioMotion({ children }: { children: ReactNode }) {
  const scope = useSectionMotion(animateStudio);
  return <section ref={scope} className="studio" aria-label="My studio">{children}</section>;
}
