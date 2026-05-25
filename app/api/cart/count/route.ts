import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET()
{
    try
    {
        const session = await auth()

        if (!session)
        {
            return NextResponse.json({ count: 0})
        }

        const sessionUser = session.user as { id?: string }

        const cart = await db.cart.findUnique({
            where: { userId: sessionUser.id! },
            include: { items: true }
        })

        const count = cart?.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) ?? 0

        return NextResponse.json({ count })
    }
    catch (error)
    {
        console.log("CART_COUNT_ERROR:", error)
        return NextResponse.json({ count: 0 })
    }
}