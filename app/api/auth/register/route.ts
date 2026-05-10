import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"


export async function POST(req: Request)
{
    try {
        const body = await req.json()
        const { name, email, password } = body

        // 1. Verify account info

            if (!name || !email || !password)
                {
                    return NextResponse.json({ message: "Missing required fields"},
                        { status: 400 }
                    )
                }
        // 2. Optimize Database
            const existingUser = await db.user.findUnique({
                where: { email },
                select: { id: true }
            })

            if (existingUser)
            {
                return NextResponse.json({ message: "Email already in use" }, { status: 409 })
            }

        // 3. This will secure the password using hash.
            
            const hashedPassword = await bcrypt.hash(password, 12)

        // 4. This will assign the user to a Default Role

            await db.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "CUSTOMER",
                }
            })

            return NextResponse.json({ message: "User registered" }, { status: 201 })
    } catch (error) {
        // Tracks and logs the actual error for debugging and return an error message to the user.

        console.error("REGISTRATION_ERROR:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
