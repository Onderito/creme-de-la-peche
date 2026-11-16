import { getCollection, getCollectionProducts, getCollections } from "@/lib/shopify/catalog/collection-service";
import { getProduct, getProducts } from "@/lib/shopify/catalog/product-service";
import { getShopifyConfig, SHOPIFY_API_VERSION } from "@/lib/shopify/shopify-config";
import { StorefrontError } from "@/lib/shopify/storefront-errors";
import type { CatalogContext, CatalogPagination } from "@/lib/shopify/types/storefront-types";

/** Diagnostic local de lecture, sans écran ni création de panier / commande. */
export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "NOT_FOUND" }, { status: 404, headers });
  }

  try {
    getShopifyConfig();
    const params = new URL(request.url).searchParams;
    const context: CatalogContext = {
      country: params.get("country") ?? undefined,
      language: params.get("language") ?? undefined,
    };
    const pagination: CatalogPagination = {
      first: params.has("first") ? Number(params.get("first")) : 5,
      after: params.get("after") ?? undefined,
    };
    const product = params.get("product");
    const productId = params.get("productId");
    const collection = params.get("collection");
    const collectionId = params.get("collectionId");
    const resource = params.get("resource");

    for (const key of ["product", "productId", "collection", "collectionId"]) {
      if (params.has(key) && !params.get(key)?.trim()) {
        throw new StorefrontError("input", "Un identifiant ne peut pas être vide.");
      }
    }
    if (resource !== null && resource !== "products" && resource !== "collections") {
      throw new StorefrontError("input", "resource doit valoir products ou collections.");
    }

    if ((product && productId) || (collection && collectionId)
      || ((product || productId) && (collection || collectionId))
      || (resource && (product || productId || collection || collectionId))) {
      throw new StorefrontError("input", "Choisir un seul produit ou une seule collection, par handle ou ID.");
    }

    if (product || productId) {
      const result = await getProduct(product ? { handle: product } : { id: productId! }, context);
      return Response.json({ apiVersion: SHOPIFY_API_VERSION, product: result }, {
        status: result ? 200 : 404, headers,
      });
    }

    if (collection || collectionId) {
      const identifier = collection ? { handle: collection } : { id: collectionId! };
      const result = params.get("metadataOnly") === "true"
        ? await getCollection(identifier, context)
        : await getCollectionProducts(identifier, pagination, context);
      return Response.json({ apiVersion: SHOPIFY_API_VERSION, collection: result }, {
        status: result ? 200 : 404, headers,
      });
    }

    if (resource === "products") {
      return Response.json({ apiVersion: SHOPIFY_API_VERSION, products: await getProducts(pagination, context) }, { headers });
    }
    if (resource === "collections") {
      return Response.json({ apiVersion: SHOPIFY_API_VERSION, collections: await getCollections(pagination, context) }, { headers });
    }
    if (pagination.after) {
      throw new StorefrontError("input", "Pour paginer, préciser resource=products ou resource=collections.");
    }

    const [collections, products] = await Promise.all([
      getCollections(pagination, context), getProducts(pagination, context),
    ]);
    return Response.json({ apiVersion: SHOPIFY_API_VERSION, collections, products }, { headers });
  } catch (error) {
    if (error instanceof StorefrontError) {
      const status = error.kind === "input" ? 400 : error.kind === "configuration" ? 503 : 502;
      return Response.json({ error: { kind: error.kind, message: error.message, codes: error.codes } }, {
        status, headers,
      });
    }
    // Next.js peut reconstruire un Error après la frontière `use cache` :
    // son prototype personnalisé et ses propriétés ne sont alors plus présents.
    if (error instanceof Error && error.name === "StorefrontError") {
      return Response.json({ error: { kind: "upstream", message: "Lecture Shopify temporairement indisponible." } }, {
        status: 502, headers,
      });
    }
    return Response.json({ error: { message: "Lecture du catalogue indisponible." } }, {
      status: 500, headers,
    });
  }
}
