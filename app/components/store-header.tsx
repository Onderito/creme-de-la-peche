import { Suspense } from "react";
import { CartCount } from "./cart-count";
import { StoreHeaderBase } from "./store-header-base";

export function StoreHeader() {
  return <StoreHeaderBase cartCount={<Suspense fallback={null}><CartCount /></Suspense>} />;
}
