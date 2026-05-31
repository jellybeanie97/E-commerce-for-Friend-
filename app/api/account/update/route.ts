import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PATCH(req: NextRequest)
{
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401})
    
    const { firstName, lastName, email, phoneNumber, dob, currentPassword, newPassword } = await req.json()

    // This will let the user update their personal info

    if (firstName || lastName || email || phoneNumber || dob)
    {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                name: `${firstName} ${lastName}`.trim(),
                email: email ?? undefined,
            },
        })
    }

    // This will allow the user to update their password

    if (currentPassword && newPassword)
    {
        const user = await db.user.findUnique({ where: { id: session.user.id } })
        if (!user?.password) return NextResponse.json({ error: "No password set"}, { status: 400 })
        
        const valid = await bcrypt.compare(currentPassword, user.password)
        if (!valid) return NextResponse.json({ error: "Current password is inccorect"}, { status: 400 })
        
        const hashed = await bcrypt.hash(newPassword, 10)
        await db.user.update({
            where: { id: session.user.id },
            data: { password: hashed },
        })
    }

    return NextResponse.json({ success: true })
}