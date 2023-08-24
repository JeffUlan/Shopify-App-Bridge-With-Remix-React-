import { 
    Page,
    LegacyCard,
    DataTable,
    // Layout,
    // Text,
    // VerticalStack,
    // Card,
    // Button,
    // HorizontalStack,
    // Box,
    // Divider,
    // List,
    // Link,
} from "@shopify/polaris"

import { authenticate } from './../shopify.server'
import { createProducts } from './helper'
import { json } from "@remix-run/node"
import { useLoaderData, useSubmit } from "@remix-run/react"

export const loader = async ({ request }) => {
    // We'll fetch all products with Graphql

    return json({
        products : []
    })
}

export async function action ({ request }) {
    const { admin } = await authenticate.admin(request)
    await createProducts(admin)

    // return json({
    //     product: response.data,
    // });
    return null
}


export default function Products () {
    const rows = []
    const submit = useSubmit()
    const { products } = useLoaderData()
    const generateProduct = () => submit({}, { replace: true, method: "POST" })

    return (
        <Page>
            <ui-title-bar title="Product Section">
                <button variant="primary" onClick={generateProduct}>
                    Generate a product
                </button>
            </ui-title-bar>
            <LegacyCard>
                <DataTable
                columnContentTypes={[
                    'text',
                    'numeric',
                    'numeric',
                    'numeric',
                    'numeric',
                ]}
                headings={[
                    'Product',
                    'Price',
                    'SKU Number',
                    'Net quantity',
                    'Net sales',
                ]}
                rows={rows}
                totals={['', '', '', 255, '$155,830.00']}
                />
            </LegacyCard>
        </Page>
    )
} 