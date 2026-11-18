"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function useIntroAnimation(screen: RefObject<HTMLDivElement | null>, signature: RefObject<HTMLSpanElement | null>, loading: boolean, scope?: RefObject<HTMLElement | null>, collection = false, onScrollReady?: (ready: boolean) => void) {
  useGSAP(() => {
    if (!screen.current || !signature.current) return;
    const media = gsap.matchMedia(scope?.current ?? screen.current);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline();
      if (!loading && !collection) {
        onScrollReady?.(false);
        scope?.current?.removeAttribute("data-intro-pending");
        gsap.set(".hero-line, .hero-copy .collection-button", { y: 0, yPercent: 120 });
        gsap.set(".hero-copy h1 .hero-line", { yPercent: 180 });
        gsap.set(".hero-artwork", { clipPath: "inset(0% 0% 100% 100%)" });
        gsap.set(".site-header--home", { y: 0, yPercent: -100, opacity: 0 });
      }
      timeline.fromTo(signature.current, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: collection ? 0.65 : 1.15, ease: "power2.inOut" }, 0.05);
      if (collection) {
        timeline.to(signature.current, { clipPath: "inset(0 0 0 100%)", duration: 0.2, ease: "power2.inOut" }, 0.8)
          .to(screen.current, { clipPath: "inset(0 0 0 100%)", duration: 0.45, ease: "power3.inOut" }, 1)
          .set(screen.current, { visibility: "hidden" });
      } else if (!loading) {
        timeline.to(signature.current, { clipPath: "inset(0 0 0 100%)", duration: 0.35, ease: "power2.inOut" }, 2.4)
          .to(screen.current, { clipPath: "inset(0 0 0 100%)", duration: 0.65, ease: "power3.inOut" }, 2.75)
          .set(screen.current, { visibility: "hidden" })
          .addLabel("hero", 3.35)
          .call(() => onScrollReady?.(true), [], "hero")
          .to(".hero-artwork", { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut", clearProps: "clipPath" }, "hero")
          .to(".site-header--home", { yPercent: 0, opacity: 1, duration: 0.65, ease: "power3.out", clearProps: "transform,opacity" }, "hero")
          .to(".hero-copy h1 .hero-line", { yPercent: 0, duration: 0.85, stagger: 0.1, ease: "power3.out", clearProps: "transform" }, "hero+=0.6")
          .to(".hero-description .hero-line", { yPercent: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "transform" }, "hero+=0.85")
          .to(".hero-copy .collection-button", { yPercent: 0, duration: 0.7, ease: "power3.out", clearProps: "transform" }, "hero+=1.05");
      }
    });
    media.add("(prefers-reduced-motion: reduce)", () => { onScrollReady?.(true); });
    return () => media.revert();
  }, { scope: scope ?? screen, dependencies: [loading, collection, onScrollReady], revertOnUpdate: true });
}
