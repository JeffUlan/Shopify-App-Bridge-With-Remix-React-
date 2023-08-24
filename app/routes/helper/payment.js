import { RECURRING_INTERVALS } from "../constants";
import { ONE_TIME_PURCHASES_QUERY, RECURRING_PURCHASES_QUERY } from "../constants/query";
import shopify from "~/shopify.server";

export const hasActivePayment = async (admin, isProd, { chargeName, interval }) => {
    if (isRecurring(interval)) {
        const currentInstallations = await admin.graphql(RECURRING_PURCHASES_QUERY)

        const subscriptions =
          currentInstallations.body.data.currentAppInstallation.activeSubscriptions;
    
        for (let i = 0, len = subscriptions.length; i < len; i++) {
            if (
                subscriptions[i].name === chargeName &&
                (!isProd || !subscriptions[i].test)
            ) {
                return true;
            }
        }
    } else {
        let purchases;
        let endCursor = null;
        do {
            const currentInstallations = await admin.graphql(ONE_TIME_PURCHASES_QUERY, 
                {
                    variables: { endCursor }
                }
            )

            purchases =
            currentInstallations.body.data.currentAppInstallation.oneTimePurchases;
    
            for (let i = 0, len = purchases.edges.length; i < len; i++) {
                const node = purchases.edges[i].node;
                if (
                    node.name === chargeName &&
                    (!isProd || !node.test) &&
                    node.status === "ACTIVE"
                ) {
                    return true;
                }
            }
    
          endCursor = purchases.pageInfo.endCursor;
        } while (purchases.pageInfo.hasNextPage);
    }
    return false;
}


export const requestPayment = async (session, admin, isProd, {
        chargeName,
        amount,
        currencyCode,
        interval,
        trials
    }) => {
    const HOST_NAME = process.env?.HOST?.replace(/https?:\/\//, "")

    
    const returnUrl = `https://${HOST_NAME}?shop=${
        session.shop
        }&host=${Buffer.from(`${session.shop}/admin`).toString('base64')}`;
    
    let data;
    if (isRecurring(interval)) {
        const mutationResponse = await requestRecurringPayment(admin, isProd, returnUrl, {
            chargeName,
            amount,
            currencyCode,
            interval,
            trials
        });
        data = mutationResponse.body.data.appSubscriptionCreate;
    } else {
        const mutationResponse = await requestSinglePayment(admin, isProd, returnUrl, {
            chargeName,
            amount,
            currencyCode,
        });
        data = mutationResponse.body.data.appPurchaseOneTimeCreate;
    }

    if (data.userErrors.length) {
        throw new ShopifyBillingError(
            "Error while billing the store",
            data.userErrors
        );
    }
    return data.confirmationUrl;
}

async function requestRecurringPayment(
    admin,
    isProd,
    returnUrl,
    { chargeName, amount, currencyCode, interval, trials }
  ) {
    const mutationResponse = await admin.graphql(RECURRING_PURCHASES_QUERY, 
        {
            variables: {
                name: chargeName,
                trialDays: parseInt(trials),
                lineItems: [
                {
                    plan: {
                    appRecurringPricingDetails: {
                        interval,
                        price: { amount, currencyCode },
                    },
                    },
                },
                ],
                returnUrl,
                test: !isProd,
            },
        }
    )
  
    if (mutationResponse.body.errors && mutationResponse.body.errors.length) {
        throw new ShopifyBillingError(
            "Error while billing the store",
            mutationResponse.body.errors
        );
    }
  
    return mutationResponse;
}

async function requestSinglePayment(
    admin,
    isProd,
    returnUrl,
    { chargeName, amount, currencyCode }
  ) {
    const mutationResponse = await admin.graphql(ONE_TIME_PURCHASES_QUERY, 
        {
            variables: {
                name: chargeName,
                price: { amount, currencyCode },
                returnUrl,
                test: process.env.NODE_ENV !== "production",
            },
        }
    )
  
    if (mutationResponse.body.errors && mutationResponse.body.errors.length) {
      throw new ShopifyBillingError(
        "Error while billing the store",
        mutationResponse.body.errors
      );
    }
  
    return mutationResponse;
}

export function ShopifyBillingError(message, errorData) {
    this.name = "ShopifyBillingError";
    this.stack = new Error().stack;
  
    this.message = message;
    this.errorData = errorData;
}

ShopifyBillingError.prototype = new Error();

function isRecurring(interval) {
    return RECURRING_INTERVALS.includes(interval);
}