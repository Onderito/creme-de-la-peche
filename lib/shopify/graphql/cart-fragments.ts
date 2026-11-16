import "server-only";
export const CART_FRAGMENT = /* GraphQL */ `
  fragment StoreCart on Cart {
    id checkoutUrl totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100, after: $after) {
      pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
      nodes {
        id quantity
        ... on CartLine { instructions { canRemove canUpdateQuantity } }
        cost {
          amountPerQuantity { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id title availableForSale currentlyNotInStock
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { url altText width height }
            selectedOptions { name value }
            quantityRule { minimum maximum increment }
            product { title handle onlineStoreUrl options { name values } }
          }
        }
      }
    }
  }
`;
