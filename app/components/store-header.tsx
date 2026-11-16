import { SiteHeader } from "./site-header";
import styles from "./store-header.module.css";

export function StoreHeader() {
  return <div className={styles.header}><SiteHeader /></div>;
}
