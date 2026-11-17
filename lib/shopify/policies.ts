/** Shopify policies rendered under /policies/[handle]; empty ones are hidden from navigation. */
export const policies = {
  "refund-policy": { field: "refundPolicy", label: "Returns & exchanges" },
  "shipping-policy": { field: "shippingPolicy", label: "Shipping" },
  "privacy-policy": { field: "privacyPolicy", label: "Privacy policy" },
  "terms-of-service": { field: "termsOfService", label: "Terms & conditions" },
} as const;

export type PolicyHandle = keyof typeof policies;
export function isPolicyHandle(handle: string): handle is PolicyHandle {
  return Object.hasOwn(policies, handle);
}
export const policyLinks = (Object.keys(policies) as PolicyHandle[]).map((handle) => ({
  handle, href: `/policies/${handle}`, label: policies[handle].label,
}));

/** Legal notice page written in this codebase (French LCEN requirement). */
export const legalNoticeLink = { href: "/legal-notice", label: "Legal notice" };
