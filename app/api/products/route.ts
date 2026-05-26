import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET()
{
    try
    {
        const products = await stripe.products.list({
            active: true,
            expand: ["data.default_price"],
        })

        const formattedProducts = products.data.map((product) => 
        {
            const price = product.default_price as import("stripe").Stripe.Price

            return {
                id: product.id,
                name: product.name,
                description: product.description,
                image: product.images[0] ?? null,
                price: price?.unit_amount ? price.unit_amount / 100 : 0,
                priceId: price?.id ?? null,
            }
        })

        return NextResponse.json(formattedProducts)
    }
    catch (error)
    {
        console.error("STRIPE_PRODUCTS_ERROR:", error)
        return NextResponse.json(
            { message: "Failed to fetch products" },
            { status: 500 }
        )
    }
}