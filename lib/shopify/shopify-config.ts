import "server-only";

import { StorefrontError } from "./storefront-errors";

/** Version stable vérifiée dans la documentation Shopify le 11 novembre 2026. */
export const SHOPIFY_API_VERSION = "2026-10";

export function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
    ?.trim()
    .replace(/^https:\/\//i, "")
    .replace(/\/$/, "")
    .toLowerCase();
  const privateToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

  // Un endpoint fixe évite d’envoyer le jeton vers un hôte ou chemin arbitraire.
  if (!domain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) {
    throw new StorefrontError(
      "configuration",
      "SHOPIFY_STORE_DOMAIN doit contenir le domaine permanent *.myshopify.com.",
    );
  }

  if (!privateToken || /[\r\n]/.test(privateToken)) {
    throw new StorefrontError(
      "configuration",
      "SHOPIFY_STOREFRONT_ACCESS_TOKEN doit contenir le jeton privé Storefront.",
    );
  }

  return {
    domain,
    privateToken,
    endpoint: `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`,
  };
}
