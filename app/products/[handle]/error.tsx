"use client";
import styles from "./product.module.css";
import { StoreHeader } from "@/app/components/store-header";

export default function ProductError({ retry }: { retry: () => void }) {
  return <div id="top"><StoreHeader /><main className={styles.notFound}><h1>A little pause.</h1><p>This piece couldn’t be loaded right now.</p><button type="button" onClick={retry}>Try again</button></main></div>;
}
