export const collectionPages = {
  "creme-de-la-peche": { title: "Original artworks", nav: "Artworks", description: "One of one. Drawn by hand, signed by me.", seoTitle: "Original drawings & artworks", seoDescription: "Explore Charlotte’s original drawings. One-of-a-kind artworks, drawn by hand and signed by the artist. Find a piece to keep from Crème de la pêche." },
  prints: { title: "Prints", nav: "Prints", description: "My drawings in print, in shades of pink.", seoTitle: "Pink art prints", seoDescription: "Discover Charlotte’s drawings as art prints in shades of pink. Feminine, sensual portraits for your walls, from Crème de la pêche." },
  shop: { title: "Clothing", nav: "Clothing", description: "My drawings on tees and sweatshirts.", seoTitle: "Illustrated tees & sweatshirts", seoDescription: "Wear Charlotte’s drawings on tees and sweatshirts. Discover illustrated clothing featuring her original designs, from Crème de la pêche." },
} as const;

export type CollectionHandle = keyof typeof collectionPages;
export function isCollectionHandle(handle: string): handle is CollectionHandle {
  return Object.hasOwn(collectionPages, handle);
}
export const collectionLinks = (Object.keys(collectionPages) as CollectionHandle[]).map((handle) => ({
  href: `/collections/${handle}`, label: collectionPages[handle].nav,
}));
