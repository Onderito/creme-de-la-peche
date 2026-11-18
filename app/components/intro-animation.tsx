"use client";

import { useRef, type RefObject } from "react";
import Image from "next/image";
import { useIntroAnimation } from "../animations/use-intro-animation";
import styles from "./intro-loader.module.css";

const previewImages = [
  "119B0AC2-E7FE-4D3F-A47F-D1C117022DEA.jpg?v=1771086316", // Black Panther
  "3D445CDB-8D16-4BD3-BFB0-D36AFAE422C4.jpg?v=1765141918", // Warrior
  "IMG-0853.heic?v=1752750948", // Geisha
  "B6186E68-F992-4308-B2A6-1524CF13BC7D.jpg?v=1751723888", // Angel
  "26DE3E99-C3C8-4064-9B1D-EC3F2CCBD223.jpg?v=1751724023", // Femme fatale
  "ED96940F-F02C-4E8A-8B44-1BA55DB2317E.jpg?v=1765142187", // Warrior with tattoos
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
