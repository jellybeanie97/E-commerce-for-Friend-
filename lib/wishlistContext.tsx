"use client"

import React, { createContext, useContext, useState } from "react"

interface WishlistProduct {
    id: string
    name: string
    image: string | null
}

interface WishlistContextType {
    showDialogue: (product: WishlistProduct, isLoggedIn: boolean) => void
    dialogueState: {
        visible: boolean
        product: WishlistProduct | null
        isLoggedIn: boolean
    }
    hideDialogue: () => void
}

const WishlistContext = createContext<WishlistContextType>({
    showDialogue: () => {},
    dialogueState: { visible: false, product: null, isLoggedIn: false },
    hideDialogue: () => {},
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [dialogueState, setDialogueState] = useState<{
        visible: boolean
        product: WishlistProduct | null
        isLoggedIn: boolean
    }>({ visible: false, product: null, isLoggedIn: false })

    const showDialogue = (product: WishlistProduct, isLoggedIn: boolean) => {
        setDialogueState({ visible: true, product, isLoggedIn })
        setTimeout(() => hideDialogue(), 4000)
    }

    const hideDialogue = () => {
        setDialogueState({ visible: false, product: null, isLoggedIn: false })
    }

    return (
        <WishlistContext.Provider value={{ showDialogue, dialogueState, hideDialogue }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => useContext(WishlistContext)