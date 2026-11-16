import "server-only";
import { isIP } from "node:net";
import { headers } from "next/headers";
/** Only trust the header overwritten by Vercel, never arbitrary X-Forwarded-For. */
export async function buyerIp() {
  if (process.env.VERCEL !== "1") return undefined;
  const value = (await headers()).get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  return value && isIP(value) ? value : undefined;
}
