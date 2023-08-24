import { 
    Page, 
    Layout, 
    HorizontalGrid, 
    Card,
    VerticalStack,
    Text
} from "@shopify/polaris";
import { useState } from "react";
import { FAKE_SUBSCRIPTION } from "./constants";

export default function SubscriptionPage () {
    const subscription = FAKE_SUBSCRIPTION 

    return (
        <Page title="Purchase A Subscription">
            <Layout>
                <HorizontalGrid gap="4" columns={subscription.length}>
                    { subscription.map((el, index) => {
                        return (
                            <Card>
                                <VerticalStack gap="5">
                                    <Text as="h2" variant="headingMd">
                                        { el.subscription_name }
                                    </Text>
                                    {/* <HorizontalStack gap="3" align="end">
                                        <Button loading={isLoading} primary onClick={productPage}>
                                            Product Page
                                        </Button>
                                    </HorizontalStack> */}
                                </VerticalStack>
                            </Card>
                        )
                    })}
                </HorizontalGrid>
            </Layout>
        </Page>
    )
}