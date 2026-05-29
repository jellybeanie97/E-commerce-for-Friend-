import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const cart = await db.cart.findUnique({
        where: { userId: session.user.id },
        include: {
            items: {
                include: { product: true },
                orderBy: { createdAt: "asc" },
            },
        },
    })

    return NextResponse.json(cart?.items ?? [])
}