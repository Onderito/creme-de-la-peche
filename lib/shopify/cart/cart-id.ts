/** Ignore malformed browser values instead of letting them block every action. */
export function usableCartId(value: string | undefined) {
  if (!value || value.length > 2048 || /\s/.test(value)) return undefined;
  try {
    const id = new URL(value);
    return id.protocol === "gid:" && id.hostname === "shopify" &&
      !id.username && !id.password && !id.port && !id.hash &&
      /^\/Cart\/[^/]+$/.test(id.pathname) && id.searchParams.get("key")
      ? value : undefined;
  } catch {
    return undefined;
  }
}
