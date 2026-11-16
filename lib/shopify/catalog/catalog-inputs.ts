import { StorefrontError } from "../storefront-errors";
import type {
  CatalogContext,
  CatalogIdentifier,
  CatalogPagination,
} from "../types/storefront-types";

export function paginationVariables({ first = 24, after }: CatalogPagination) {
  // Limite de page de l’API Shopify ; ce n’est pas une limite de quantité d’achat.
  if (!Number.isInteger(first) || first < 1 || first > 250) {
    throw new StorefrontError("input", "La taille de page doit être comprise entre 1 et 250.");
  }
  if (after !== undefined && (typeof after !== "string" || !after.trim())) {
    throw new StorefrontError("input", "Curseur de pagination invalide.");
  }
  return { first, after: after ?? null };
}

export function resolveIdentifier(identifier: CatalogIdentifier) {
  const id = identifier.id?.trim();
  const handle = identifier.handle?.trim();
  if (Boolean(id) === Boolean(handle)) {
    throw new StorefrontError("input", "Fournir exactement un handle ou un ID.");
  }
  return id
    ? { argument: "id" as const, value: id }
    : { argument: "handle" as const, value: handle! };
}

export function contextVariables({ country, language }: CatalogContext) {
  const normalizedCountry = country?.trim().toUpperCase();
  const normalizedLanguage = language?.trim().toUpperCase();
  if (country !== undefined && !/^[A-Z]{2}$/.test(normalizedCountry ?? "")) {
    throw new StorefrontError("input", "Code pays invalide.");
  }
  if (language !== undefined && !/^[A-Z]{2,3}(?:_[A-Z]{2})?$/.test(normalizedLanguage ?? "")) {
    throw new StorefrontError("input", "Code langue invalide.");
  }
  // Shopify reste l’autorité pour les codes pris en charge et les marchés actifs.
  return { country: normalizedCountry ?? null, language: normalizedLanguage ?? null };
}
