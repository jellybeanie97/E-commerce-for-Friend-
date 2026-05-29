import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function DELETE(req: NextRequest)
{
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const { cartItemId } = await req.json()

    await db.cartItem.delete({ where: { id: cartItemId } })

    return NextResponse.json({ success: true })
}