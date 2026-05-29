import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function PATCH(req: NextRequest)
{
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
     
    const { cartItemId, quantity } = await req.json()

    if (quantity < 1)
    {
        await db.cartItem.delete({ where: { id: cartItemId } })
        return NextResponse.json({ success: true })
    }

    const item = await db.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    })

    return NextResponse.json(item)
}