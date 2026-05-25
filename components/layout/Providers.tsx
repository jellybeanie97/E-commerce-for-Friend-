"use client"

import { SessionProvider } from "next-auth/react"
import { ShoppingCartProvider } from "@/lib/real-timeCart"

export default function Providers({ children }: { children: React.ReactNode })
{
    return (
        <SessionProvider>
            <ShoppingCartProvider>
                {children}
            </ShoppingCartProvider>
        </SessionProvider>
    )
}