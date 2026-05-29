"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/real-timeCart"

interface WishlistItem 
{
    id: string
    productId: string
    product: 
    {
        id: string
        name: string
        price: number
        image: string | null
        description: string | null
    }
}

export default function WishlistPage()
{
    const [items, setItems] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [addedToBag, setAddedToBag] = useState<Record<string, boolean>>({})
    const { updatedCart } = useCart()

    useEffect(() => {
        fetch("/api/wishlist")
            .then((res) => res.ok ? res.json() : [])
            .then((data) => setItems(data))
            .catch((error) => console.error("FETCH_WISHLIST_ERROR:", error))
            .finally(() => setLoading(false))
    }, [])

    const removeItem = async (productId: string) => {
        await fetch("/api/wishlist/remove", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
        })
        setItems((prev) => prev.filter((item) => item.productId !== productId))
    }

    const addToCart = async (productId: string) => {
        try {
            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: 1 }),
            })
            if (res.ok) {
                updatedCart()
                setAddedToBag((prev) => ({ ...prev, [productId]: true }))
                setTimeout(() => setAddedToBag((prev) => ({ ...prev, [productId]: false })), 2000)
            }
        } catch (error) {
            console.error("ADD_TO_CART_ERROR:", error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-lumea-rose-400 text-lg">Loading your wishlist...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen px-6 py-8 max-w-4xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-8">
                <Link href="/" className="hover:text-lumea-rose-500 transition-colors">Home</Link>
                <span>|</span>
                <Link href="/shop" className="hover:text-lumea-rose-500 transition-colors">Shop</Link>
                <span>|</span>
                <span>Wishlist</span>
            </nav>

            <h1 className="font-heading text-3xl font-bold mb-8">My Wishlist</h1>

            {items.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                    <p className="text-2xl font-heading font-bold">Your wishlist is empty</p>
                    <p className="text-sm text-foreground/50">Save items you love and come back to them later.</p>
                    <Link href="/shop" className="text-lumea-rose-500 hover:underline text-sm">
                        Browse the Shop →
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="glass rounded-2xl flex gap-4 p-3 items-center relative">

                            {/* Product Image - allows the user to click on image and takes them to the product detail page */}
                            <Link
                                href={`/shop/${item.productId}`}
                                className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0"
                            >
                                {item.product.image ? (
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-lumea-rose-100 to-lumea-rose-200 flex items-center justify-center">
                                        <span className="text-3xl">🌸</span>
                                    </div>
                                )}
                            </Link>

                            {/* Product Info */}
                            <div className="flex flex-col flex-1 gap-1">
                                <h3 className="font-heading font-bold text-base">{item.product.name}</h3>
                                <p className="text-xs text-foreground/50 line-clamp-1">{item.product.description ?? "A luxurious Lumea fragrance"}</p>
                                <p className="text-lumea-rose-600 font-bold">${item.product.price.toFixed(2)}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => addToCart(item.productId)}
                                    className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 text-white ${
                                        addedToBag[item.productId]
                                            ? "bg-green-500 scale-95"
                                            : "bg-lumea-rose-500 hover:bg-lumea-rose-600"
                                    }`}
                                >
                                    {addedToBag[item.productId] ? "✓ Added!" : "Add to Bag"}
                                </button>
                                <button
                                    onClick={() => removeItem(item.productId)}
                                    className="text-xs text-foreground/40 hover:text-red-400 transition-colors glass px-3 py-2 rounded-xl"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
