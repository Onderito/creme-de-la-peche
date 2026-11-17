export const collectionPages = {
  "creme-de-la-peche": { title: "Original artworks", nav: "Artworks", description: "One of one. Drawn by hand, signed by me." },
  prints: { title: "Prints", nav: "Prints", description: "My drawings in print, in shades of pink." },
  shop: { title: "Clothing", nav: "Clothing", description: "My drawings on tees and sweatshirts." },
} as const;

export type CollectionHandle = keyof typeof collectionPages;
export function isCollectionHandle(handle: string): handle is CollectionHandle {
  return Object.hasOwn(collectionPages, handle);
}
export const collectionLinks = (Object.keys(collectionPages) as CollectionHandle[]).map((handle) => ({
  href: `/collections/${handle}`, label: collectionPages[handle].nav,
}));
