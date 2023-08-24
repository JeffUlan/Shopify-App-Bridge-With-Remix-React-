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

export const QUERY_ORDER = ``
