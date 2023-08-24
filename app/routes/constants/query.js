export const DEFAULT_PRODUCTS_COUNT = 5

export const QUERY_PRODUCT = `
    {
        products (first: 20) {
            nodes {
                id,
                title,
                description,
                createdAt
            }
        }
    }`

export const RECURRING_PURCHASES_QUERY = `
    query appSubscription {
      currentAppInstallation {
        activeSubscriptions {
          name, test
        }
      }
    }
  `
  
export const ONE_TIME_PURCHASES_QUERY = `
    query appPurchases($endCursor: String) {
      currentAppInstallation {
        oneTimePurchases(first: 250, sortKey: CREATED_AT, after: $endCursor) {
          edges {
            node {
              name, test, status
            }
          }
          pageInfo {
            hasNextPage, endCursor
          }
        }
      }
    }
  `

export const QUERY_ORDER = ``
