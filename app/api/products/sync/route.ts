import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST() {
    const products = await stripe.products.list({
        active: true,
        expand: ["data.default_price"],
        limit: 100,
    })

    for (const product of products.data) {
        const price = product.default_price as import("stripe").Stripe.Price
        const amount = price?.unit_amount ? price.unit_amount / 100 : 0

        await db.product.upsert({
            where: { id: product.id },
            update: {
                name: product.name,
                description: product.description ?? "",
                price: amount,
                image: product.images?.[0] ?? "",
                isActive: product.active,
            },
            create: {
                id: product.id,
                name: product.name,
                description: product.description ?? "",
                price: amount,
                image: product.images?.[0] ?? "",
                isActive: product.active,
                stock: 0,
            },
        })
    }

    return NextResponse.json({ synced: products.data.length })
}