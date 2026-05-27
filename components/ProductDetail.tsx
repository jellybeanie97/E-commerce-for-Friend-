"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/real-timeCart"

interface Props {
    product: {
    id: string
    name: string
    description: string
    price: number
    image: string | null
    }
}

const dropdownItems = [
    {
        label:"Returns and Shipping",
        content: "Free Shipping on orders over $65. Returns must be processed within 30 days of purchase.",
    },
    {
        label: "Product Description",
        content: "",
    },
    {
        label: "Similar Products",
        content: "Browse more from our collection in the shop.",
    },
]

export default function ProductDetail({ product }: Props) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [wishlisted, setWishlisted] = useState(false)
    const { updatedCart } = useCart()

    const addToCart = async () => {
        try {
            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id, quantity: 1}),
            })
            if (res.ok)
            {
                updatedCart()   // this will refresh the cart count located in the navbar.
            }
        }   catch (error)
            {
                console.error("ADD_TO_CART_ERROR:", error)
            }
    }

    const toggle = (label: string) =>
        setOpenDropdown(openDropdown === label ? null : label)

    return (
        <div className="min-h-screen px-6 py-8 max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-8">
            <Link href="/" className="hover:text-lumea-rose-500 transition-colors">Home</Link>
            <span>|</span>
            <Link href="/shop" className="hover:text-lumea-rose-500 transition-colors">Shop</Link>
        </nav>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-12">

            {/* Left - Images */}
            <div className="flex flex-col gap-4 flex-1">
                {/* Main Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden glass">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-lumea-rose-100 to-lumea-rose-200 flex items-center justify-center">
                            <span className="text-8xl">🌸</span>
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-xl overflow-hidden glass cursor-pointer hover:ring-2 hover:ring-lumea-rose-400 transition-all"
                        >
                            {product.image ? (
                                <Image
                                    src ={product.image}
                                    alt={`${product.name} view ${i + 1}`}
                                    width={120}
                                    height={120}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-lumea-rose-100 to-lumea-rose-200 flex items-center justify-center">
                                    <span className="text-2xl">🌸</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right - Info */}
            <div className="flex flex-col gap-4 flex-1">

                {/* Name & Price */}
                <div>
                    <h1 className="font-heading text-3xl font-bold mb-1">{product.name}</h1>
                    <p className="text-2xl font-bold text-lumea-rose-600">
                        ${product.price.toFixed(2)}
                    </p>
                </div>

                {/* Add to Bag + Wishlist Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => addToCart()}
                        className="flex-1 bg-lumea-rose-500 hover:bg-lumea-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            Add to Bag
                        </button>
                        <button
                            onClick={() => setWishlisted(!wishlisted)}
                            className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-lumea-rose-50 transition-colors"
                        >
                            <Image
                                src="/icons/heart.svg"
                                alt="Wishlist"
                                className={`w-5 h-5 transition-all ${
                                wishlisted
                                    ? "filter-[invert(40%)_sepia(80%)_saturate(400%)_hue-rotate(300deg)]"
                                    : "opacity-40"
                            }`}
                            />
                        </button>
                    </div>

                    {/* Dropdown Box */}
                    <div className="flex flex-col gap-2 mt-2">
                        {dropdownItems.map(({ label, content }) => (
                            <div key={label} className="glass rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggle(label)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
                                >
                                    {label}
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${openDropdown === label ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {openDropdown === label && (
                                    <div className="px-4 pb-4 text-sm text-foreground/60">
                                        {label === "Description" ? product.description : content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

