"use client";

import { useRef, type RefObject } from "react";
import { useIntroAnimation } from "../animations/use-intro-animation";
import styles from "./intro-loader.module.css";

export function IntroAnimation({ loading = false, collection = false }: { loading?: boolean; collection?: boolean }) {
  const screen = useRef<HTMLDivElement>(null);
  const signature = useRef<HTMLSpanElement>(null);

  useIntroAnimation(screen, signature, loading, undefined, collection);

  return <IntroVisual screen={screen} signature={signature} loading={loading} />;
}

export function IntroVisual({ screen, signature, loading = false }: { screen: RefObject<HTMLDivElement | null>; signature: RefObject<HTMLSpanElement | null>; loading?: boolean }) {
  return <><noscript><style>{`.${styles.screen}:not(.${styles.loading}) { display: none; }`}</style></noscript><div ref={screen} className={`${styles.screen} ${loading ? styles.loading : ""}`} role={loading ? "status" : undefined} aria-label={loading ? "Loading page" : undefined} aria-hidden={loading ? undefined : true}>
    <div className={styles.composition}>
      <span ref={signature} className={styles.signature} aria-hidden={loading ? true : undefined}>crème de la pêche</span>
    </div>
  </div></>;
}
