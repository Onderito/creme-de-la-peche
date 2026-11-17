import "server-only";
import { cookies } from "next/headers";
import { CART_COOKIE_MAX_AGE, CART_COOKIE_NAME } from "./cart-cookie-policy";
import { usableCartId } from "./cart-id";
export async function readCartId() {
  return usableCartId((await cookies()).get(CART_COOKIE_NAME)?.value);
}
export async function saveCartId(id: string) {
  (await cookies()).set(CART_COOKIE_NAME, id, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: CART_COOKIE_MAX_AGE,
  });
}
export async function clearCartId() {
  (await cookies()).delete(CART_COOKIE_NAME);
}
