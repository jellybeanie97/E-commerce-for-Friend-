"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface RealTimeCartType
{
    cartCount: number
    updatedCart: () => void
}

const RealTimeCart = createContext<RealTimeCartType>({
    cartCount: 0,
    updatedCart: () => {},
})

export function ShoppingCartProvider({ children }: { children: React.ReactNode })
{
    const { data: session } = useSession()
    const [cartCount, setCartCount] = useState(0)

    const updatedCart = async () =>
    {
        if (!session) return setCartCount(0)

        try
        {
            const res = await fetch("/api/cart/count")
            if (res.ok)
            {
                const data = await res.json()
                setCartCount(data.count)
            }
        }
        catch (error)
        {
            console.error("CART_COUNT_ERROR:", error)
        }
    }

    useEffect(() =>
    {
        updatedCart()
    }, [session])

    return (
        <RealTimeCart.Provider value={{ cartCount, updatedCart }}>
            {children}
        </RealTimeCart.Provider>
    )
}

export const useCart = () => useContext(RealTimeCart)

