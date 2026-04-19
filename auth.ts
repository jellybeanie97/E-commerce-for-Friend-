import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
/* eslint-disable @typescript-eslint/no-explicit-any */

export const { handlers, signIn, signOut, auth } = NextAuth
({ session: { strategy: "jwt" },
    pages: { signIn: "/auth/login" },
    providers: 
    [
        Credentials
        (
            {
                credentials: 
                { 
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" },
                },

    async authorize(credentials): Promise<any>
    {
        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !password) return null

        const user = await db.user.findUnique({ where: { email }})

        if (!user) return null
        if (!user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) return null

        const returnUser = 
        {
            id: user!.id,
            email: user!.email,
            name: user!.name,
            role: user!.role,
        }

        return returnUser
    },
}),
],
callbacks: 
    {
        async jwt({ token, user})
        {
            if (user)
            {
                token.role = (user as any).role
                token.id = user.id
            }
            return token
        },
        async session({ session, token })
        {
            if (session.user)
            {
                (session.user as any).role = token.role
                ;(session.user as any).id = token.id
            }
            return session
        },
    },
})