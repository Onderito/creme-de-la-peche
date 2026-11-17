import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import styles from "./store-header.module.css";

/** Header layout shared by server pages and client error boundaries. */
export function StoreHeaderBase({ cartCount }: { cartCount?: ReactNode }) {
  return <div className={styles.header}><SiteHeader cartCount={cartCount} /></div>;
}
