import type { Metadata } from "next";
import type { ShopifyImage } from "./shopify/types/storefront-types";

export const siteName = "Crème de la pêche";
export const siteUrl = new URL(process.env.SITE_URL || "https://cremedelapeche.shop").origin;
export const indexable = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";
export const siteDescription = "Discover Charlotte’s original drawings, art prints, tees and sweatshirts. Drawn by hand. Feminine, sensual, a little bold.";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function socialImage(image: ShopifyImage) {
  const url = new URL(image.url);
  // Social crawlers need a common image format, including for HEIC originals.
  url.searchParams.set("format", "jpg");
  return { url: url.toString(), alt: image.altText || siteName, width: image.width ?? undefined, height: image.height ?? undefined };
}

export function pageMetadata({ title, description, path, images }: {
  title: string;
  description: string;
  path: string;
  images?: ReturnType<typeof socialImage>[];
}): Metadata {
  const fullTitle = `${title} — ${siteName}`;
  const shareImages = images?.length ? images : [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${siteName} — Original drawings, prints & clothing` }];
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName, title: fullTitle, description, url: path, locale: "en_GB", images: shareImages },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: shareImages },
  };
}

export function excerpt(text: string, length = 160) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= length) return normalized;
  return `${normalized.slice(0, length - 1).replace(/\s+\S*$/, "").trimEnd()}…`;
}
