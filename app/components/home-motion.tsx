"use client";

import { useRef, type ReactNode } from "react";
import { IntroVisual } from "./intro-animation";
import { useIntroAnimation } from "../animations/use-intro-animation";

export function HomeMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const signature = useRef<HTMLSpanElement>(null);
  useIntroAnimation(screen, signature, false, scope);
  return <main id="top" ref={scope} data-intro-pending="">
    <noscript><style>{`
      [data-intro-pending] .hero-line,
      [data-intro-pending] .hero-copy .collection-button,
      [data-intro-pending] .site-header--home { transform: none; opacity: 1; }
      [data-intro-pending] .hero-artwork { clip-path: none; }
    `}</style></noscript>
    <IntroVisual screen={screen} signature={signature} />{children}
  </main>;
}
