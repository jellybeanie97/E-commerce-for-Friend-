import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest)
{
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const { productId, quantity = 1 } = await req.json()

// Create the cart

    let cart = await db.cart.findUnique({ where: { userId: session.user.id } })
    if (!cart)
    {
        cart = await db.cart.create({ data: { userId: session.user.id } })
    }

// Insert the cart item

    const item = await db.cartItem.upsert({
        where: { cartId_productId: { cartId: cart?.id, productId } },
        update: { quantity: { increment: quantity } },
        create: {cartId: cart?.id, productId, quantity },
    })

    return NextResponse.json(item)

}