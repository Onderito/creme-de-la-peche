"use client";

import { useContext, useRef, type ReactNode } from "react";
import { useScrollReveals } from "../animations/use-scroll-reveals";
import { ScrollRevealsReadyContext } from "../animations/scroll-reveals-context";

export function ScrollRevealGroup({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const ready = useContext(ScrollRevealsReadyContext);
  useScrollReveals(scope, ready);

  return <div ref={scope} data-scroll-reveal-scope="" className="scroll-reveal-scope">{children}</div>;
}
