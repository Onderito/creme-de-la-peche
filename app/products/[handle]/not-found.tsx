import Link from "next/link";
import styles from "./product.module.css";
import { StoreHeader } from "@/app/components/store-header";

export default function ProductNotFound() {
  return <div id="top"><StoreHeader /><main className={styles.notFound}><h1>This piece couldn’t be found.</h1><p>There’s more of my world to explore.</p><Link href="/#collections">Explore my collections</Link></main></div>;
}
