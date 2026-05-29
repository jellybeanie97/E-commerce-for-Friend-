"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/real-timeCart"
import { useRouter } from "next/navigation"

interface CartItem {
    id: string
    quantity: number
    product: {
        id: string
        name: string
        price: number
        image: string | null
    }
}

const FREE_SHIPPING_THRESHOLD = 65

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [promoCode, setPromoCode] = useState("")
    const [promoApplied, setPromoApplied] = useState(false)
    const [promoError, setPromoError] = useState("")
    const [checkingOut, setCheckingOut] = useState(false)
    const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({})
    const { updatedCart } = useCart()
    const router = useRouter()

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart")
            if (res.ok) {
                const data = await res.json()
                setItems(data)
            }
        } catch (error) {
            console.error("FETCH_CART_ERROR:", error)
        }
    }

    useState(() => {
        fetch("/api/cart")
            .then((res) => res.ok ? res.json() : [])
            .then((data) => setItems(data))
            .catch((error) => console.error("FETCH_CART_ERROR:", error))
            .finally(() => setLoading(false))
    })

    const removeItem = async (cartItemId: string) => {
        await fetch("/api/cart/remove", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItemId }),
        })
        fetchCart()
        updatedCart()
    }

    const updateQuantity = async (cartItemId: string, quantity: number) => {
        await fetch("/api/cart/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItemId, quantity }),
        })
        fetchCart()
        updatedCart()
    }

    const applyPromo = async () => {
        setPromoError("")
        setPromoApplied(false)
        if (!promoCode.trim()) return
        setPromoApplied(true)
    }

    const handleCheckout = async () => {
        setCheckingOut(true)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promoCode: promoApplied ? promoCode : "" }),
            })
            const data = await res.json()
            if (data.url) {
                router.push(data.url)
            } else {
                console.error("No checkout URL at this time.")
            }
        } catch (error) {
            console.error("CHECKOUT_ERROR:", error)
        } finally {
            setCheckingOut(false)
        }
    }

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity, 0
    )
    const amountLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-lumea-rose-400 text-lg">Updating your bag...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-8">
                <Link href="/" className="hover:text-lumea-rose-500 transition-colors">Home</Link>
                <span>|</span>
                <Link href="/shop" className="hover:text-lumea-rose-500 transition-colors">Shop</Link>
                <span>|</span>
                <span>Cart</span>
            </nav>

            {/* Free Shipping Gauge Meter */}
            <div className="glass rounded-2xl p-4 mb-8 text-center space-y-2">
                <div className="w-full bg-lumea-rose-100 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-lumea-rose-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${shippingProgress}%` }}
                    />
                </div>
                {amountLeft > 0 ? (
                    <p className="text-sm text-foreground/60">
                        Spend <span className="font-bold text-lumea-rose-500">${amountLeft.toFixed(2)}</span> more for <span className="font-bold">FREE SHIPPING!</span>
                    </p>
                ) : (
                    <p className="text-sm font-bold text-lumea-rose-500">🎉 You have unlocked free shipping!</p>
                )}
            </div>

            {items.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                    <p className="text-2xl font-heading font-bold">Your bag is empty</p>
                    <Link href="/shop" className="text-lumea-rose-500 hover:underline text-sm">
                        Continue Shopping →
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left - Cart Items */}
                    <div className="flex flex-col gap-4 flex-1 max-w-xl">
                        {items.map((item) => (
                            <div key={item.id} className="glass rounded-2xl overflow-hidden flex gap-4 p-2 relative">

                                {/* Wishlist heart - top right */}
                                <div className="absolute top-3 right-3 z-10">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        className="cursor-pointer transition-all duration-200"
                                        fill={wishlisted[item.id] ? "#c81e6c" : "none"}
                                        stroke="#c81e6c"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        onClick={() => setWishlisted((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                                        onMouseEnter={(e) => { if (!wishlisted[item.id]) (e.currentTarget as SVGElement).setAttribute("fill", "#c81e6c") }}
                                        onMouseLeave={(e) => { if (!wishlisted[item.id]) (e.currentTarget as SVGElement).setAttribute("fill", "none") }}
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                </div>

                                {/* Product Image */}
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
                                    {item.product.image ? (
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-lumea-rose-100 to-lumea-rose-200 flex items-center justify-center">
                                            <span className="text-3xl">🌸</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col flex-1 py-1 pr-2">
                                    <div>
                                        <h3 className="font-heading font-bold text-base">{item.product.name}</h3>
                                        <p className="text-lumea-rose-600 font-bold">${item.product.price.toFixed(2)}</p>
                                    </div>

                                    {/* Quantity + Delete - bottom right */}
                                    <div className="flex items-center justify-end gap-3 mt-auto pt-4">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-xs text-foreground/40 hover:text-red-400 transition-colors glass px-3 py-1.5 rounded-lg"
                                        >
                                            Delete
                                        </button>
                                        <div className="flex items-center glass rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1.5 text-sm hover:bg-lumea-rose-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1.5 text-sm hover:bg-lumea-rose-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:w-[28rem] shrink-0 ml-8">
                        <div className="glass rounded-2xl p-6 space-y-4 lg:sticky lg:top-24">

                            {/* Subtotal */}
                            <div>
                                <p className="font-heading font-bold text-lg">
                                    Estimated Subtotal: <span className="text-lumea-rose-600">${subtotal.toFixed(2)}</span>
                                </p>
                                <p className="text-xs text-foreground/40 mt-1">
                                    Taxes and Shipping rates will apply at checkout.
                                </p>
                            </div>

                            {/* Promo Code */}
                            <div className="flex items-center glass rounded-xl overflow-hidden">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter a Promo Code"
                                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-foreground/30"
                                />
                                <button
                                    onClick={applyPromo}
                                    className="bg-lumea-rose-500 hover:bg-lumea-rose-600 text-white font-bold px-4 py-2 text-sm transition-colors"
                                >
                                    APPLY
                                </button>
                            </div>
                            {promoApplied && (
                                <p className="text-xs text-green-500">Promo code applied! Discount will show at checkout.</p>
                            )}
                            {promoError && (
                                <p className="text-xs text-red-400">{promoError}</p>
                            )}

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className="w-full bg-lumea-rose-500 hover:bg-lumea-rose-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                {checkingOut ? "Redirecting..." : "Proceed to Checkout"}
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}