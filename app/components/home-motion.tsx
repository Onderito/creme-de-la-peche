"use client";

import { useRef, useState, type ReactNode } from "react";
import { IntroVisual } from "./intro-animation";
import { useIntroAnimation } from "../animations/use-intro-animation";
import { useReveals } from "../animations/use-reveals";
import { ScrollRevealsReadyContext } from "../animations/scroll-reveals-context";

export function HomeMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const signature = useRef<HTMLSpanElement>(null);
  const [scrollReady, setScrollReady] = useState(false);
  useIntroAnimation(screen, signature, false, scope, false, setScrollReady);
  useReveals(scope, scrollReady);
  return <ScrollRevealsReadyContext.Provider value={scrollReady}><main id="top" ref={scope} data-intro-pending="" data-reveal-scope="">
    <noscript><style>{`
      [data-intro-pending] .hero-line,
      [data-intro-pending] .hero-copy .collection-button,
      [data-intro-pending] .site-header--home { transform: none; opacity: 1; }
      [data-intro-pending] .hero-artwork { clip-path: none; }
    `}</style></noscript>
    <IntroVisual screen={screen} signature={signature} />{children}
  </main></ScrollRevealsReadyContext.Provider>;
}
