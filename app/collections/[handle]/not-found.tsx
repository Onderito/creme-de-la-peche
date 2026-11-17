import Link from "next/link";
import { StoreHeader } from "@/app/components/store-header";
import styles from "./collection.module.css";
export default function NotFound() {
  return <div id="top"><StoreHeader /><main className={styles.message}><h1>Collection not found.</h1><p>Explore the collections to find your next piece.</p><Link href="/#collections">Explore collections</Link></main></div>;
}
