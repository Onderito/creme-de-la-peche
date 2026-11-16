import "server-only";

import type { StorefrontErrorKind } from "./types/storefront-types";

/** Ne conserve ni jeton, ni corps HTTP, ni variables GraphQL sensibles. */
export class StorefrontError extends Error {
  readonly kind: StorefrontErrorKind;
  readonly status?: number;
  readonly codes: string[];

  constructor(
    kind: StorefrontErrorKind,
    message: string,
    details: { status?: number; codes?: string[] } = {},
  ) {
    super(message);
    this.name = "StorefrontError";
    this.kind = kind;
    this.status = details.status;
    this.codes = details.codes ?? [];
  }
}
