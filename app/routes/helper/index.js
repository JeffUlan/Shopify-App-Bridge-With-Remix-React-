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

import { hasActivePayment, requestPayment } from './payment';

let isProd

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

export const createCharge = async (admin, session, bodyRequest) => {
    return  await createApplicationRecurringCharge(session, bodyRequest, admin)
}

export const createApplicationRecurringCharge = async (session, response, admin) => {
    const [hasPayment, confirmationUrl] = await ensureBilling(
        session,
        response,
        admin
    );
    return { hasPayment, confirmationUrl }
}

const ensureBilling = async (
    session, 
    { chargeName, amount, currencyCode, interval, trials },
    admin,
    isProdOverride = process.env.TEST_BILLING === "production") => {
    
    isProd = isProdOverride
    
    let hasPayment;
    let confirmationUrl = null;
    
    if (await hasActivePayment(admin, isProd, { chargeName, interval })) {
        hasPayment = true;
    } else {
        hasPayment = false;
        confirmationUrl = await requestPayment(admin, {
            chargeName,
            amount,
            currencyCode,
            interval,
            trials
        });
    }
      
    return [hasPayment, confirmationUrl];
}

