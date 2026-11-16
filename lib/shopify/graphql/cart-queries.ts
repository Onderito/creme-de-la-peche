import "server-only";
import { CART_FRAGMENT } from "./cart-fragments";
export const CART_QUERY = /* GraphQL */ `
  query StoreCart($id: ID!, $after: String) {
    cart(id: $id) { ...StoreCart }
  }
  ${CART_FRAGMENT}
`;
