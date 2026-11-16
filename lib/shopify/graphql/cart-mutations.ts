import "server-only";
const RESULT = `cart { id } userErrors { code field message } warnings { code message }`;
export const CART_CREATE = `mutation StoreCartCreate($input: CartInput!) {
  cartCreate(input: $input) { ${RESULT} }
}`;
export const CART_ADD = `mutation StoreCartAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) { ${RESULT} }
}`;
export const CART_UPDATE = `mutation StoreCartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) { ${RESULT} }
}`;
export const CART_REMOVE = `mutation StoreCartRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { ${RESULT} }
}`;
