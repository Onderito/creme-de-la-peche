import Link from "next/link";
import { StoreHeader } from "./components/store-header";
import styles from "./not-found.module.css";

export default function NotFound() {
  return <div id="top">
    <StoreHeader />
    <main className={styles.page}>
      <p className={styles.code}>404 / Page not found</p>
      <h1>A little off the page.</h1>
      <p className={styles.description}>This page couldn’t be found. There’s still plenty to discover.</p>
      <div className={styles.links}>
        <Link className={styles.primary} href="/collections/creme-de-la-peche">Explore my originals</Link>
        <Link className={styles.secondary} href="/">Back to home</Link>
      </div>
      <p className={styles.signature} aria-hidden="true">crème de la pêche</p>
    </main>
  </div>;
}
