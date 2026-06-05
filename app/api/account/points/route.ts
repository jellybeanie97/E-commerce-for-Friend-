import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET()
{
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            points: true,
            createdAt: true,
            pointsHistory: {
                orderBy: { createdAt: "desc" },
                take: 20,
            },
        },
    })

    return NextResponse.json(user)
}