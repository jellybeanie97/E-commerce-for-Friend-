import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest)
{
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const { promoCode } = await req.json()

    const cart = await db.cart.findUnique({
        where: { userId: session.user.id },
        include: { items: { include: { product: true } } },
    })

    if (!cart?.items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 401 })
    
    // Integrating promo code through Stripe

    let discounts: { promotion_code: string }[] = []
    if (promoCode)
    {
        try {
            const codes = await stripe.promotionCodes.list({ code: promoCode, active: true })
            if (codes.data.length > 0)
            {
                discounts = [{ promotion_code: codes.data[0].id }]
            }
        } catch {
            // if the promo discount code is not recognized than it will
            // display text saying "Not found. Please try again."
            // it will then proceed without the discount
        }
    }

    const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        discounts,
        line_items: cart.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.product.name,
                    images: item.product.image ? [item.product.image] : [],
                },
                unit_amount: Math.round(item.product.price * 100),
            },
            quantity: item.quantity,
        })),
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop?order=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    })

    return NextResponse.json({ url: stripeSession.url })
}