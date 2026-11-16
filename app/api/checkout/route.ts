import { NextRequest, NextResponse } from "next/server";
import { readCartId } from "@/lib/shopify/cart/cart-cookie";
import { getCheckoutUrl, OriginalQuantityError } from "@/lib/shopify/checkout/checkout-service";
import { getOriginalArtworkHandles } from "@/lib/shopify/catalog/original-artworks";
import { buyerIp } from "@/lib/shopify/request/buyer-ip";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return new Response("Forbidden", { status: 403 });
  }
  let destination: string;
  try {
    const [id, ip, originals] = await Promise.all([readCartId(), buyerIp(), getOriginalArtworkHandles()]);
    destination = (await getCheckoutUrl(id, new Set(originals), ip))
      ?? new URL("/cart?checkout=empty", request.url).toString();
  } catch (error) {
    destination = new URL(error instanceof OriginalQuantityError ? "/cart?checkout=unique" : "/cart?checkout=unavailable", request.url).toString();
  }
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
