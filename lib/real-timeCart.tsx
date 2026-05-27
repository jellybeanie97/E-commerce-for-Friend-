"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
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

export function ShoppingCartProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const [cartCount, setCartCount] = useState(0)
    const setCountRef = useRef(setCartCount)


    useEffect(() => {
        if (!session) {
            setCountRef.current(0)
            return
        }
        fetch("/api/cart/count")
            .then((res) => res.ok ? res.json() : null)
            .then((data) => { if (data) setCountRef.current(data.count) })
            .catch((error) => console.error("CART_COUNT_ERROR:", error))
    }, [session])

    const updatedCart = () => {
        if (!session) return setCartCount(0)
        fetch("/api/cart/count")
            .then((res) => res.ok ? res.json() : null)
            .then((data) => { if (data) setCartCount(data.count) })
            .catch((error) => console.error("CART_COUNT_ERROR:", error))
    }

    return (
        <RealTimeCart.Provider value={{ cartCount, updatedCart }}>
            { children }
        </RealTimeCart.Provider>
    )
}

export const useCart = () => useContext(RealTimeCart)