export function productPath(handle: string) {
  return `/products/${encodeURIComponent(handle)}`;
}
