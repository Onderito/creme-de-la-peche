import "server-only";
import { cookies } from "next/headers";
const COOKIE = "cdlp_cart";
export async function readCartId() {
  return (await cookies()).get(COOKIE)?.value;
}
export async function saveCartId(id: string) {
  (await cookies()).set(COOKIE, id, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 10,
  });
}
export async function clearCartId() {
  (await cookies()).delete(COOKIE);
}
