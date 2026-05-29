import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest)
{
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { productId } = await req.json()

    const item = await db.wishlist.upsert({
        where: { userId_productId: { userId: session.user.id, productId } },
        update: {},
        create: { userId: session.user.id, productId },
        include: { product: true },
    })

    return NextResponse.json(item)
}