import styles from "./components/intro-loader.module.css";

export default function Loading() {
  return (
    <div className={`${styles.screen} ${styles.loading}`} role="status" aria-label="Loading page">
      <span className={styles.signature} aria-hidden="true">crème de la pêche</span>
    </div>
  );
}
