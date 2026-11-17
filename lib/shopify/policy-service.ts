import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { storefrontRequest } from "./storefront-client";
import { policies, type PolicyHandle } from "./policies";

export async function getPolicy(handle: PolicyHandle) {
  "use cache";
  cacheLife("hours");
  cacheTag("shopify:policies");
  const field = policies[handle].field;
  const { shop } = await storefrontRequest<{ shop: Record<string, { title: string; body: string } | null> }>({
    document: `query ShopPolicy { shop { ${field} { title body } } }`,
  });
  const policy = shop[field];
  if (!policy?.body || !sanitizeHtml(policy.body, { allowedTags: [], allowedAttributes: {} }).trim()) return null;
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
