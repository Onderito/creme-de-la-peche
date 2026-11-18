import Image from "next/image";
import Link from "next/link";
import { CharlotteIntroMotion } from "../animations/charlotte-intro-motion";
import { BehindDrawingsMotion } from "../animations/behind-drawings-motion";
import { FirstLinesMotion } from "../animations/first-lines-motion";
import { PaperFirstMotion } from "../animations/paper-first-motion";
import { PlaceMotion } from "../animations/place-motion";
import drawingDetail from "../../public/images/charlotte/charlotte-drawing-detail.webp";
import portrait from "../../public/images/charlotte/charlotte-studio-portrait.webp";
import firstLines from "../../public/images/charlotte/charlotte-first-lines.webp";
import atWork from "../../public/images/charlotte/charlotte-at-work.webp";
import styles from "./meet-charlotte.module.css";

function ChapterLine({ children }: { children: string }) {
  return <span className={styles.introLineMask}><span className={styles.chapterLine}>{children}</span></span>;
}

export function MeetCharlotte() {
  return (
    <section id="charlotte" className={styles.section} aria-labelledby="charlotte-title">
      <CharlotteIntroMotion />

      <BehindDrawingsMotion>
        <h3 id="behind-drawings-title" className={`${styles.chapterTitle} ${styles.behindTitle}`}>
          <ChapterLine>Behind the</ChapterLine>{" "}
          <ChapterLine>Drawings</ChapterLine>
        </h3>
        <div className={styles.wallImage}>
          <Image
            src={drawingDetail}
            alt="Charlotte’s tattooed hands drawing a graphite portrait, surrounded by sketches"
            fill
            className={styles.wallPhoto}
            sizes="(max-width: 700px) 65vw, 33vw"
          />
        </div>
        <div className={styles.portraitImage}>
          <Image
            src={portrait}
            alt="Charlotte looking up from her drawing, with framed artwork on her studio walls"
            fill
            className={styles.portraitPhoto}
            sizes="(max-width: 700px) 100vw, 58vw"
          />
        </div>
        <p className={styles.signature}>Charlotte</p>
        <div className={`${styles.copy} ${styles.behindCopy}`}>
          <h4>A lifelong instinct.</h4>
          <p>
            I’ve been drawing for as long as I can remember. Over time, it
            became more than something I loved doing. It became my work.
          </p>
        </div>
      </BehindDrawingsMotion>

      <FirstLinesMotion>
        <div className={styles.drawingImage}>
          <Image
            src={firstLines}
            alt="Over Charlotte’s shoulder as she adds pencil details to a portrait"
            fill
            sizes="(max-width: 700px) 85vw, 50vw"
          />
        </div>
        <h3 id="first-lines-title" className={`${styles.chapterTitle} ${styles.firstTitle}`}>
          <ChapterLine>The First Lines</ChapterLine>
        </h3>
        <div className={`${styles.copy} ${styles.firstCopy}`}>
          <h4>It started at home.</h4>
          <p>
            Three years ago, I decided to see if I could make a living from my
            art. I started from my apartment, with my own drawings.
          </p>
        </div>
      </FirstLinesMotion>

      <PaperFirstMotion>
        <h3 id="paper-first-title" className={`${styles.chapterTitle} ${styles.paperTitle}`}>
          <ChapterLine>Paper first.</ChapterLine>
        </h3>
        <p className={styles.paperCopy}>
          <span>Every original begins on paper.</span>
          <span>Find one you’d like to keep.</span>
        </p>
        <Link className="collection-button" href="/collections/creme-de-la-peche">
          Explore my originals
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 16 16 4M5 4h11v11" />
          </svg>
        </Link>
      </PaperFirstMotion>

      <PlaceMotion>
        <div className={styles.galleryImage}>
          <Image
            src={atWork}
            alt="Charlotte at her studio table, surrounded by her original pencil drawings"
            fill
            sizes="(max-width: 700px) 85vw, 66vw"
          />
        </div>
        <h3 id="place-title" className={`${styles.chapterTitle} ${styles.placeTitle}`}>
          <ChapterLine>A Place of My Own</ChapterLine>
        </h3>
        <div className={`${styles.copy} ${styles.placeCopy}`}>
          <h4>Room to grow.</h4>
          <p>
            A year later, I opened my own studio. It gave me a place to draw,
            tattoo and welcome the people who connect with my work.
          </p>
        </div>
      </PlaceMotion>
    </section>
  );
}
