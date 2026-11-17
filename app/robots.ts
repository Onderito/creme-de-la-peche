import type { MetadataRoute } from "next";
import { absoluteUrl, indexable } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexable
      ? { userAgent: "*", allow: "/", disallow: ["/api/", "/cart", "/account", "/checkout"] }
      : { userAgent: "*", disallow: "/" },
    ...(indexable ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
