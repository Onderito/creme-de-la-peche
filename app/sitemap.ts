import type { MetadataRoute } from "next";
import { absoluteUrl, socialImage } from "@/lib/seo";
import { collectionLinks } from "@/lib/shopify/collection-pages";
import { getProducts } from "@/lib/shopify/catalog/product-service";
import { collectConnection } from "@/lib/shopify/catalog/catalog-pagination";
import { productPath } from "@/lib/shopify/product-path";
import { getLegalLinks } from "@/lib/shopify/policy-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const first = await getProducts({ first: 100 });
  const legalLinks = await getLegalLinks();
  const products = await collectConnection(first, (after) => getProducts({ first: 100, after }));
  return [
    { url: absoluteUrl("/"), priority: 1 },
    ...collectionLinks.map(({ href }) => ({ url: absoluteUrl(href), priority: 0.8 })),
    ...products.map((product) => ({
      url: absoluteUrl(productPath(product.handle)),
      ...(product.featuredImage ? { images: [socialImage(product.featuredImage).url] } : {}),
      priority: 0.7,
    })),
    ...legalLinks.map(({ href }) => ({ url: absoluteUrl(href), priority: 0.2 })),
  ];
}
