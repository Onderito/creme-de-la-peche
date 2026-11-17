import type { ReactNode } from "react";
import { IntroAnimation } from "@/app/components/intro-animation";

// The route template mounts with the page shell, before Shopify content streams in.
// Next remounts it when the collection handle changes, but not for pagination.
export default function CollectionTemplate({ children }: { children: ReactNode }) {
  return <><IntroAnimation collection />{children}</>;
}
