import { 
    CREATE_ORDER_MUTATIONS,
    CREATE_PRODUCT_MUTATIONS, 
} from './../constants/mutations';

import {
    DEFAULT_PRODUCTS_COUNT, 
    QUERY_ORDER, 
    QUERY_PRODUCT 
} from './../constants/query';

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

export const getPartialProducts = async (admin) => {
    return await admin.graphql(QUERY_PRODUCT)
}

export const createOrder = async (admin, ...params) => {
    return await admin.graphql(CREATE_ORDER_MUTATIONS,
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

export const getPartialOrders = async (admin) => {
    return await admin.graphql(QUERY_ORDER)
}