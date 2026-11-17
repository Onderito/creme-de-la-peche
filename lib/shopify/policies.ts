/** Non-empty policies verified on the existing storefront on 2026-11-17. */
export const policies = {
  "refund-policy": { field: "refundPolicy", label: "Returns & exchanges" },
  "privacy-policy": { field: "privacyPolicy", label: "Privacy policy" },
  "terms-of-service": { field: "termsOfService", label: "Terms & conditions" },
} as const;

export type PolicyHandle = keyof typeof policies;
export function isPolicyHandle(handle: string): handle is PolicyHandle {
  return Object.hasOwn(policies, handle);
}
export const policyLinks = (Object.keys(policies) as PolicyHandle[]).map((handle) => ({
  href: `/policies/${handle}`, label: policies[handle].label,
}));
