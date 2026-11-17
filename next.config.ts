import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/collections/artworks", destination: "/collections/creme-de-la-peche", permanent: true },
      { source: "/collections/artworks/art", destination: "/collections/creme-de-la-peche", permanent: true },
      { source: "/products/copy-of-oversize-hoodie-n-51", destination: "/products/oversized-hoodie-n-51", permanent: true },
      { source: "/collections/:collection/products/:handle", destination: "/products/:handle", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" },
    ],
  },
};

export default nextConfig;
