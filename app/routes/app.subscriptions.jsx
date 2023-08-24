import { 
    Page, 
    Layout, 
    HorizontalGrid, 
    Card,
    VerticalStack,
    Text,
    List,
    Divider,
    HorizontalStack,
    Button
} from "@shopify/polaris";
import { useState } from "react";
import { FAKE_SUBSCRIPTION } from "./constants";
import { authenticate } from "~/shopify.server";
import { useSubmit } from "@remix-run/react";
import { createCharge } from "./helper";
import { json } from "@remix-run/node";

export async function action ({ request }) {
    const { admin, session } = await authenticate.admin(request)

    const payload = {
        required: true,
        chargeName: request.body.subscription_name,
        amount: parseFloat(request.body.amount).toFixed(2),
        currencyCode: 'USD',
        interval: 'EVERY_30_DAYS',
        trials : 0
    }
    const res = await createCharge(admin, session, payload)
    const response = await res.json();

    return json(response);
}

export default function SubscriptionPage () {
    const subscription = FAKE_SUBSCRIPTION
    const submit = useSubmit()
    const subscribePackage = (items) => event => {
        submit(items, { replace: true, method: "POST" })
    }

    return (
        <Page title="Purchase A Subscription">
            <Layout>
                <HorizontalGrid gap="4" columns={subscription.length}>
                    { subscription.map((el, index) => {
                        return (
                            <Card key={index}>
                                <Placeholder height="340px">
                                    <VerticalStack gap="5">
                                        <Text as="h2" variant="headingMd">
                                            { el.subscription_name }
                                        </Text>
                                    </VerticalStack>
                                    <VerticalStack gap="5">
                                        <List type="bullet">
                                            { el.features.map((item, i) => {
                                                return (
                                                    <List.Item key={i}>{item}</List.Item>
                                                )
                                            })}
                                        </List>
                                    </VerticalStack>
                                    <Divider />
                                    <VerticalStack gap="5">
                                        <HorizontalStack gap="3" align="center">
                                            <Button primary onClick={subscribePackage(el)}>
                                                Subscribe
                                            </Button>
                                        </HorizontalStack>
                                    </VerticalStack>
                                </Placeholder>
                            </Card>
                        )
                    })}
                </HorizontalGrid>
            </Layout>
        </Page>
    )
}

const Placeholder = ({height = 'auto', width = 'auto', children}) => {
        return (
            <div
                style={{
                    display: 'inherit',
                    height: height ?? undefined,
                    width: width ?? undefined,
                }}
            >
                { children }
            </div>
        );
  };