export const DEFAULT_PRODUCTS_COUNT = 5

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

export const QUERY_PRODUCT_MUTATIONS = `
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



