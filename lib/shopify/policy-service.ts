import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { storefrontRequest } from "./storefront-client";
import { legalNoticeLink, policies, policyLinks, type PolicyHandle } from "./policies";

type PolicyField = { title: string; body: string } | null;

function hasContent<T extends { body: string }>(policy: T | null | undefined): policy is T {
  return !!policy?.body && !!sanitizeHtml(policy.body, { allowedTags: [], allowedAttributes: {} }).trim();
}

export async function getPolicy(handle: PolicyHandle) {
  "use cache";
  cacheLife("hours");
  cacheTag("shopify:policies");
  const field = policies[handle].field;
  const { shop } = await storefrontRequest<{ shop: Record<string, PolicyField> }>({
    document: `query ShopPolicy { shop { ${field} { title body } } }`,
  });
  const policy = shop[field];
  if (!hasContent(policy)) return null;
  return {
    title: policy.title,
    body: sanitizeHtml(policy.body, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, "h1"],
      allowedAttributes: { a: ["href", "title"], th: ["scope", "colspan", "rowspan"], td: ["colspan", "rowspan"] },
      allowedSchemes: ["https", "http", "mailto", "tel"],
      allowProtocolRelative: false,
    }),
  };
}

/** Links to the policies filled in on Shopify, followed by the legal notice. */
export async function getLegalLinks() {
  "use cache";
  cacheLife("hours");
  cacheTag("shopify:policies");
  let available = policyLinks;
  try {
    const fields = policyLinks.map(({ handle }) => `${policies[handle].field} { body }`).join(" ");
    const { shop } = await storefrontRequest<{ shop: Record<string, { body: string } | null> }>({
      document: `query ShopPolicies { shop { ${fields} } }`,
    });
    available = policyLinks.filter(({ handle }) => hasContent(shop[policies[handle].field]));
  } catch {
    // Keep every link rather than hiding the shop's policies when Shopify is unreachable.
  }
  return [...available.map(({ href, label }) => ({ href, label })), legalNoticeLink];
}
