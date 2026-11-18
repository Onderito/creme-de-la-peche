"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide smooth scrolling.
 * - Driven by GSAP's ticker so ScrollTrigger animations stay perfectly in sync.
 * - Wheel/trackpad only: touch devices keep native scrolling (Lenis default).
 * - Disabled automatically when the visitor prefers reduced motion.
 * - Elements with `data-lenis-prevent` (e.g. the cart dialog) keep their own native scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, stopInertiaOnNavigate: true });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchors (e.g. "/#faq" while on "/"): handled here, before Next's Link,
    // so the browser jump and the smooth scroll don't fight each other.
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      // Same landing spot as native anchors: honour `scroll-padding-top` from globals.css (header height).
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const destination = () => target!.getBoundingClientRect().top + window.scrollY - padding;
      lenis.scrollTo(destination(), {
        immediate: lenis.prefersReducedMotion,
        // Images loading on the way can move the target; settle on its final position.
        onComplete: () => {
          if (Math.abs(target!.getBoundingClientRect().top - padding) > 2) lenis.scrollTo(destination(), { duration: 0.4 });
        },
      });
      if (location.hash !== url.hash) history.pushState(history.state, "", url.hash);
    }
    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
