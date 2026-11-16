import type { ShopifyMoney } from "./types/storefront-types";

export function formatMoney(money: ShopifyMoney) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency", currency: money.currencyCode,
    minimumFractionDigits: Number.isInteger(Number(money.amount)) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number(money.amount));
}
