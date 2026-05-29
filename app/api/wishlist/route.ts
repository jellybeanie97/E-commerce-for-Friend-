import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET()
{
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const wishlist = await db.wishlist.findMany({
        where: { userId: session.user.id },
        include: { product: true },
        orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(wishlist)
}