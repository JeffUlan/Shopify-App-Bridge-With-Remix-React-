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

export default function SubscriptionPage () {
    const subscription = FAKE_SUBSCRIPTION
    const subscribePackage = (ele) => event => console.log(ele)

    return (
        <Page title="Purchase A Subscription">
            <Layout>
                <HorizontalGrid gap="4" columns={subscription.length}>
                    { subscription.map((el, index) => {
                        return (
                            <Card key={index}>
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
                            </Card>
                        )
                    })}
                </HorizontalGrid>
            </Layout>
        </Page>
    )
}