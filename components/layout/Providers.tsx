"use client"

import { SessionProvider } from "next-auth/react"
import { ShoppingCartProvider } from "@/lib/real-timeCart"
import { WishlistProvider } from "@/lib/wishlistContext";

export default function Providers({ children }: { children: React.ReactNode })
{
    return (
        <SessionProvider>
            <ShoppingCartProvider>
                <WishlistProvider>
                {children}
                </WishlistProvider>
            </ShoppingCartProvider>
        </SessionProvider>
    )
}