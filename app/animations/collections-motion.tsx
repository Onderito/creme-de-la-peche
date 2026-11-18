"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { gsap } from "gsap";
import { revealLines, useSectionMotion } from "./section-motion";

function animateIntro(header: HTMLElement) {
  header.querySelectorAll<HTMLElement>("h2, p").forEach(revealLines);
}

export function CollectionsIntroMotion({ children }: { children: ReactNode }) {
  const scope = useSectionMotion(animateIntro);
  return <header ref={scope} className="collections-intro">{children}</header>;
}

function animateCollection(section: HTMLElement) {
  section.querySelectorAll<HTMLElement>(".collection-heading h3, .collection-heading p").forEach(revealLines);

  const link = section.querySelector(".collection-view-all");
  if (link) {
    gsap.fromTo(link, { clipPath: "inset(100% 0% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.58,
      ease: "power2.out",
      clearProps: "clipPath",
      scrollTrigger: { trigger: link, start: "top 85%", once: true },
    });
  }

  section.querySelectorAll(".product-image").forEach((image) => {
    gsap.fromTo(image, { clipPath: "inset(100% 0% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.9,
      ease: "power2.inOut",
      clearProps: "clipPath",
      scrollTrigger: { trigger: image, start: "top 93%", once: true },
    });
  });
}

export function CollectionGroupMotion(props: ComponentPropsWithoutRef<"section">) {
  const scope = useSectionMotion(animateCollection);
  return <section ref={scope} {...props} />;
}
