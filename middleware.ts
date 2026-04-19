import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => 
    {
        const { nextUrl, auth: session } = req 

        const isLoggedIn = !!session
        const isAdmin = (session?.user as { role?: string })?.role === "ADMIN"

        const isAuthRoute = nextUrl.pathname.startsWith("/auth")
        const isAdminRoute = nextUrl.pathname.startsWith("/admin")

// 1. Redirect to Login: Guest trying to access Admin
    
    if (isAdminRoute && !isLoggedIn)
        {
            return NextResponse.redirect(new URL("/auth/login", nextUrl))
        }

// 2. Redirect to Home: Logged-in user on Auth route OR Non-Admin on Admin route
    
    const shouldRedirectToHome = (isAuthRoute && isLoggedIn) || (isAdminRoute && !isAdmin)

        if (shouldRedirectToHome)
        {
            return NextResponse.redirect(new URL("/", nextUrl))
        }

        return NextResponse.next()
    })

    export const config = 
    {
        matcher: ["/admin/:path*", "/auth/:path*"],
    }