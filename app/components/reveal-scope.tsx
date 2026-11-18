"use client";

import { useContext, useRef, type ReactNode } from "react";
import { useReveals } from "../animations/use-reveals";
import { ScrollRevealsReadyContext } from "../animations/scroll-reveals-context";

/** Reveal scope for homepage content streamed in later (the Shopify product showcase). */
export function RevealScope({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const ready = useContext(ScrollRevealsReadyContext);
  useReveals(scope, ready);
  return <div ref={scope} data-reveal-scope="" className="reveal-scope">{children}</div>;
}
