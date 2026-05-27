import { stripe } from "@/lib/stripe"
import { notFound } from "next/navigation"
import ProductDetail from "@/components/ProductDetail"
import { Stripe } from "stripe";

export default async function ProductPage({ params }: {params: { id: string } }) {
    const product = await stripe.products.retrieve(params.id, {
        expand: ["default_price"],
    })

    if (!product) notFound()

    const price = product.default_price as Stripe.Price

    return (
        <ProductDetail
            product={{
                id: product.id,
                name: product.name,
                description: product.description ?? "",
                price: price.unit_amount ? price.unit_amount / 100 : 0,
                image: product.images?.[0] ?? null,
            }}
        />
    )
}