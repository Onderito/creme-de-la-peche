import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "./add-to-cart";
import { ScrollRevealGroup } from "./scroll-reveal-group";
import { productPath } from "@/lib/shopify/product-path";
import { getCollectionProducts } from "@/lib/shopify/catalog/collection-service";
import { getProduct } from "@/lib/shopify/catalog/product-service";
import type { Product, ProductSummary } from "@/lib/shopify/types/product-types";
import type { ShopifyMoney } from "@/lib/shopify/types/storefront-types";

const STOREFRONT_URL = "https://cremedelapeche.shop";

function formatPrice(money: ShopifyMoney) {
  const amount = Number(money.amount);
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function artworkDetails(product: Product) {
  const medium = product.description.match(/Made with (.+?)\s+Size:/i)?.[1];
  const size = product.description.match(/Size:\s*(.+?\bcm)\b/i)?.[1];
  return [
    medium ? medium.charAt(0).toUpperCase() + medium.slice(1) : null,
    size?.replace(/\s*x\s*/g, " × "),
  ].filter(Boolean).join(" · ");
}

function ProductCard({ product, original = false }: { product: ProductSummary; original?: boolean }) {
  const image = product.featuredImage;
  if (!image) return null;

  // Shopify converts HEIC originals to a browser-compatible format at its CDN.
  const imageUrl = new URL(image.url);
  imageUrl.searchParams.set("format", "webp");
  const hasPriceRange = Number(product.priceRange.maxVariantPrice.amount) > Number(product.priceRange.minVariantPrice.amount);
  const details = original && "description" in product ? artworkDetails(product as Product) : "";

  return (
    <article className={`product-card${original ? " product-card--original" : ""}`}>
      <Link className="product-link" href={productPath(product.handle)}>
        <div className="product-image" data-scroll-reveal="image">
          <Image
            src={imageUrl.toString()}
            alt={image.altText || product.title}
            fill
            sizes={original ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 50vw, 25vw"}
          />
          {!product.availableForSale && <span className="product-sold-out">Sold out</span>}
        </div>
        <div className="product-caption" data-scroll-reveal="block">
          <h4>{product.title}</h4>
          <span className="product-price">
            {hasPriceRange ? "from " : ""}{formatPrice(product.priceRange.minVariantPrice)}
          </span>
        </div>
      </Link>
      {original && "description" in product && (
        <p className="product-description" data-scroll-reveal="text">
          Original, 1 of 1
          {details && <span className="product-description-details"> · {details}</span>}
        </p>
      )}
      {original && "variants" in product && product.availableForSale && (
        <div data-scroll-reveal="block"><AddToCart compact handle={product.handle} title={product.title} variants={(product as Product).variants.map(({ id, title, price, availableForSale }) => ({ id, title, price, availableForSale }))} /></div>
      )}
    </article>
  );
}

function CollectionHeading({ id, title, description, handle, cta }: {
  id: string;
  title: string;
  description: string;
  handle: string;
  cta: string;
}) {
  return (
    <header className="collection-heading">
      <div>
        <h3 id={id} data-scroll-reveal="text">{title}</h3>
        <p data-scroll-reveal="text" data-reveal-delay="0.04">{description}</p>
      </div>
      <Link className="collection-view-all" data-scroll-reveal="block" href={`/collections/${handle}`}>{cta}</Link>
    </header>
  );
}

/** Live Shopify selection, with the same editorial hierarchy as the Figma. */
export async function ProductShowcase() {
  let catalog;
  try {
    catalog = await Promise.all([
      getProduct({ handle: "black-panther" }),
      getProduct({ handle: "bon-a-petit" }),
      getCollectionProducts({ handle: "prints" }, { first: 4 }),
      getCollectionProducts({ handle: "shop" }, { first: 8 }),
    ]);
  } catch {
    return (
      <p className="catalog-message" role="status">
        The collections are temporarily unavailable. <a href={STOREFRONT_URL}>Explore the shop ↗</a>
      </p>
    );
  }

  const [firstArtwork, secondArtwork, prints, clothing] = catalog;
  const clothingOrder = ["oversized-tee-n-51", "copy-of-oversize-hoodie-n-51"];
  const clothingProducts = [...(clothing?.products.nodes ?? [])]
    .filter((product) => product.featuredImage)
    .sort((a, b) => {
      const rank = (handle: string) => {
        const index = clothingOrder.indexOf(handle);
        return index < 0 ? clothingOrder.length : index;
      };
      return rank(a.handle) - rank(b.handle);
    })
    .slice(0, 4);

  return (
    <ScrollRevealGroup>
      <section className="collection-group collection-group--artworks" aria-labelledby="artworks-title">
        <header className="collection-heading collection-heading--original">
          <div>
            <h3 id="artworks-title" data-scroll-reveal="text">Original Artworks</h3>
            <p data-scroll-reveal="text" data-reveal-delay="0.04">One of one. Drawn by hand, signed by me.</p>
          </div>
        </header>
        <div className="artworks-grid">
          {firstArtwork && <ProductCard product={firstArtwork} original />}
          <div className="artwork-secondary">
            {secondArtwork && <ProductCard product={secondArtwork} original />}
          </div>
          <Link className="collection-view-all artworks-view-all" data-scroll-reveal="block" href="/collections/creme-de-la-peche">
            View all artworks
          </Link>
        </div>
      </section>

      <section className="collection-group" aria-labelledby="prints-title">
        <CollectionHeading
          id="prints-title"
          title="Prints"
          description="My drawings in print, in shades of pink."
          handle="prints"
          cta="View the pink series"
        />
        <div className="products-grid">
          {prints?.products.nodes.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="collection-group" aria-labelledby="clothing-title">
        <CollectionHeading
          id="clothing-title"
          title="Clothing"
          description="My drawings on tees and sweatshirts."
          handle="shop"
          cta="View all clothing"
        />
        <div className="products-grid products-grid--clothing">
          {clothingProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </ScrollRevealGroup>
  );
}
