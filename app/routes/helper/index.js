import { 
    CREATE_PRODUCT_MUTATIONS, 
    DEFAULT_PRODUCTS_COUNT, 
    QUERY_PRODUCT_MUTATIONS 
} from '../constants/mutations';

import { 
    randomTitle
} from './../constants'

export const createProducts = async (admin) => {
    for (let i = 0; i < DEFAULT_PRODUCTS_COUNT; i++) { // We are creating 5 products
        await admin.graphql(CREATE_PRODUCT_MUTATIONS,
            {
              variables: {
                input: {
                  title: randomTitle(),
                  variants: [{ price: Math.random() * 100 }],
                },
              },
            }
        );
    }
    return null
}

export const getAllProducts = async (admin) => {
    return await admin.graphql(QUERY_PRODUCT_MUTATIONS)
}