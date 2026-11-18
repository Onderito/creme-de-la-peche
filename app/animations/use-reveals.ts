"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Homepage scroll reveals: a simple fade-up.
 *
 *   data-reveal         the element fades in while rising slightly
 *   data-reveal-group   its data-reveal children play one after another, on one trigger
 *   data-reveal-batch   its direct children (product cards) fade up row by row
 *
 * Targets are hidden by CSS before the first paint (`html.reveals` in globals.css) so nothing
 * flashes, and marked `data-revealed` once shown.
 */

const FROM = { autoAlpha: 0, y: 24 };
const TO = { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.1 };
const START = "top 85%";

function show(targets: Element[]) {
  return gsap.fromTo(targets, FROM, {
    ...TO,
    onComplete: () => {
      targets.forEach((target) => target.setAttribute("data-revealed", ""));
      gsap.set(targets, { clearProps: "transform,opacity,visibility" });
    },
  });
}

export function useReveals(scope: RefObject<HTMLElement | null>, ready = true) {
  useGSAP(() => {
    const root = scope.current;
    if (!root || !ready) return;
    const owned = (element: Element) => element.closest("[data-reveal-scope]") === root;

    const media = gsap.matchMedia(root);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // Groups: one trigger, children in reading order.
      const groups = new Map<Element, Element[]>();
      root.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((element) => {
        if (!owned(element)) return;
        const group = element.closest("[data-reveal-group]");
        const key = group && owned(group) ? group : element;
        groups.set(key, [...(groups.get(key) ?? []), element]);
      });
      groups.forEach((items, trigger) => {
        ScrollTrigger.create({ trigger, start: START, once: true, onEnter: () => show(items) });
      });

      // Batches: product cards, row by row.
      root.querySelectorAll("[data-reveal-batch]").forEach((container) => {
        if (!owned(container)) return;
        const cards = [...container.children].filter((card) => !card.hasAttribute("data-revealed"));
        ScrollTrigger.batch(cards, { start: "top 90%", once: true, onEnter: (entered) => { show(entered); } });
      });
    });

    return () => media.revert();
  }, { scope, dependencies: [ready], revertOnUpdate: true });
}
