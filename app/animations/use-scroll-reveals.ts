"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** Each scope owns its reveals, including collections streamed in by Shopify. */
export function useScrollReveals(scope: RefObject<HTMLElement | null>, ready: boolean) {
  useGSAP((_context, contextSafe) => {
    const root = scope.current;
    if (!root || !ready || !contextSafe) return;

    const media = gsap.matchMedia(root);
    let frame = 0;
    const initialize = contextSafe(() => {
      const ownedTargets = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-reveal]"))
        .filter((element) => element.closest("[data-scroll-reveal-scope]") === root);
      // Next can mount a streamed subtree before revealing its hidden container.
      // A trigger created at height zero would consume its once-only animation.
      if (ownedTargets.some((element) => {
        const bounds = element.getBoundingClientRect();
        return !bounds.width || !bounds.height;
      })) {
        frame = requestAnimationFrame(initialize);
        return;
      }
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const splits: SplitText[] = [];
        ownedTargets.forEach((element) => {
          const delay = Number(element.dataset.revealDelay ?? 0);
          const trigger = { trigger: element, start: "top 92%", once: true };

          if (element.dataset.scrollReveal === "line") {
            // Explicit editorial lines share one heading trigger and move together.
            gsap.fromTo(element, { yPercent: 105 }, {
              yPercent: 0,
              duration: 0.65,
              ease: "power2.out",
              scrollTrigger: { ...trigger, trigger: element.closest("h2") ?? element },
              clearProps: "transform",
            });
          } else if (element.dataset.scrollReveal === "text") {
            let revealed = false;
            splits.push(SplitText.create(element, {
              type: "lines",
              mask: "lines",
              tag: "span",
              // Generic spans and paragraphs cannot be named with aria-label.
              // Keep their real text exposed; headings support SplitText's label.
              aria: /^H[1-6]$/.test(element.tagName) ? "auto" : "none",
              linesClass: "scroll-reveal-line",
              autoSplit: true,
              onSplit: (split) => {
                // Resizing must reflow lines without replaying a completed reveal.
                if (revealed) return gsap.set(split.lines, { yPercent: 0 });
                return gsap.fromTo(split.lines, { yPercent: 105 }, {
                  yPercent: 0,
                  duration: 0.65,
                  stagger: 0.045,
                  delay,
                  ease: "power2.out",
                  scrollTrigger: trigger,
                  onComplete: () => { revealed = true; },
                });
              },
            }));
          } else {
            const image = element.dataset.scrollReveal === "image";
            gsap.fromTo(element, {
              clipPath: "inset(100% 0% 0% 0%)",
              y: image ? 0 : 8,
            }, {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              duration: image ? 0.8 : 0.55,
              delay,
              ease: "power2.inOut",
              scrollTrigger: trigger,
              clearProps: "clipPath,transform",
            });
          }
        });

        // Late collection content can shift the story section's trigger positions.
        ScrollTrigger.refresh();
        return () => { splits.forEach((split) => split.revert()); };
      });
    });
    frame = requestAnimationFrame(initialize);

    return () => { cancelAnimationFrame(frame); media.revert(); };
  }, { scope, dependencies: [ready], revertOnUpdate: true });
}
