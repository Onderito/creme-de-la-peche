import "server-only";

import { isIP } from "node:net";

import { getShopifyConfig } from "./shopify-config";
import { StorefrontError } from "./storefront-errors";
import type { StorefrontRequest } from "./types/storefront-types";

const REQUEST_TIMEOUT_MS = 15_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Transport sans cache et sans retry automatique : une mutation ne doit jamais
 * être répétée silencieusement. Seuls les services catalogue ajoutent un cache.
 */
export async function storefrontRequest<TData>({
  document,
  variables = {},
  buyerIp,
  signal,
}: StorefrontRequest): Promise<TData> {
  const { endpoint, privateToken } = getShopifyConfig();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": privateToken,
  };

  if (buyerIp !== undefined) {
    if (!isIP(buyerIp)) {
      throw new StorefrontError("input", "Adresse IP de l’acheteur invalide.");
    }
    headers["Shopify-Storefront-Buyer-IP"] = buyerIp;
  }

  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: document, variables }),
      cache: "no-store",
      redirect: "error",
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch {
    // Ne pas conserver la cause : elle peut contenir la requête et ses secrets.
    throw new StorefrontError(
      "network",
      "La requête Shopify a été interrompue ou le service est injoignable.",
    );
  }

  if (!response.ok) {
    throw new StorefrontError(
      "http",
      `La Storefront API a répondu avec le statut HTTP ${response.status}.`,
      { status: response.status },
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new StorefrontError("invalid-response", "Réponse Shopify non JSON.");
  }

  if (!isRecord(payload)) {
    throw new StorefrontError("invalid-response", "Réponse Shopify invalide.");
  }

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const codes = payload.errors.flatMap((error: unknown) => {
      const code = isRecord(error) && isRecord(error.extensions)
        ? error.extensions.code
        : undefined;
      return typeof code === "string" && /^[A-Z_]+$/.test(code) ? [code] : [];
    });
    // Les données partielles ne sont pas présentées comme une lecture réussie.
    throw new StorefrontError("graphql", "Shopify a refusé la requête GraphQL.", {
      codes,
    });
  }

  if (!isRecord(payload.data)) {
    throw new StorefrontError("invalid-response", "Réponse Shopify sans données.");
  }

  return payload.data as TData;
}
