
export const CREATE_PRODUCT_MUTATIONS = `#graphql
    mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
        product {
            id
            title
            handle
            status
            variants(first: 10) {
                edges {
                    node {
                        id
                        price
                        barcode
                        createdAt
                    }
                }
            }
        }
    }
}`

export const CREATE_ORDER_MUTATIONS = ``

const RECURRING_PURCHASE_MUTATION = `
  mutation test(
    $name: String!
    $trialDays: Int
    $lineItems: [AppSubscriptionLineItemInput!]!
    $returnUrl: URL!
    $test: Boolean
  ) {
    appSubscriptionCreate(
      name: $name
      trialDays: $trialDays
      lineItems: $lineItems
      returnUrl: $returnUrl
      test: $test
    ) {
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }
`;

const ONE_TIME_PURCHASE_MUTATION = `
  mutation test(
    $name: String!
    $price: MoneyInput!
    $returnUrl: URL!
    $test: Boolean
  ) {
    appPurchaseOneTimeCreate(
      name: $name
      price: $price
      returnUrl: $returnUrl
      test: $test
    ) {
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }
`;