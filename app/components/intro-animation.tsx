"use client";

import { useRef, type RefObject } from "react";
import Image from "next/image";
import { useIntroAnimation } from "../animations/use-intro-animation";
import styles from "./intro-loader.module.css";

const previewImages = [
  "119B0AC2-E7FE-4D3F-A47F-D1C117022DEA.jpg?v=1771086316",
  "IMG-0625.jpg?v=1771082938",
  "IMG_3446.heic?v=1728474165",
  "86CA98EB-7126-4362-B7DA-7BF5F12D75C8.jpg?v=1765212933",
  "0EE35927-09FF-4896-AE26-6BB16574E68E.jpg?v=1765211072",
  "9ABDE2B7-14C2-4A8E-AC21-C1F3D33CE1F0.jpg?v=1765210854",
];

export function IntroAnimation({ loading = false, collection = false }: { loading?: boolean; collection?: boolean }) {
  const screen = useRef<HTMLDivElement>(null);
  const signature = useRef<HTMLSpanElement>(null);

  useIntroAnimation(screen, signature, loading, undefined, collection);

  return <IntroVisual screen={screen} signature={signature} loading={loading} showImages={!loading && !collection} />;
}

export function IntroVisual({ screen, signature, loading = false, showImages = !loading }: { screen: RefObject<HTMLDivElement | null>; signature: RefObject<HTMLSpanElement | null>; loading?: boolean; showImages?: boolean }) {
  return <><noscript><style>{`.${styles.screen}:not(.${styles.loading}) { display: none; }`}</style></noscript><div ref={screen} className={`${styles.screen} ${loading ? styles.loading : ""}`} role={loading ? "status" : undefined} aria-label={loading ? "Loading page" : undefined} aria-hidden={loading ? undefined : true}>
    <div className={styles.composition}>
      {showImages && <div className={styles.preview} data-intro-frame aria-hidden="true">
        {previewImages.map((file, index) => <div key={file} className={styles.slide} data-intro-slide>
          <Image src={`https://cdn.shopify.com/s/files/1/0522/9966/1499/files/${file}&format=webp`} alt="" fill sizes="(max-width: 700px) 140px, 180px" preload={index === 0} loading={index === 0 ? undefined : "eager"} />
        </div>)}
      </div>}
    <span ref={signature} className={styles.signature} aria-hidden={loading ? true : undefined}>crème de la pêche</span>
    </div>
  </div></>;
}
