"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/real-timeCart"
import { useSession } from "next-auth/react"
import { useWishlist } from "@/lib/wishlistContext"

interface Props {
    product: {
        id: string
        name: string
        description: string
        price: number
        image: string | null
        images?: string[]
    }
}

const dropdownItems = [
    {
        label: "Returns and Shipping",
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
    const [addedToBag, setAddedToBag] = useState(false)
    const [activeThumb, setActiveThumb] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
    const imageRef = useRef<HTMLDivElement>(null)
    const { updatedCart } = useCart()
    const { data: session } = useSession()
    const { showDialogue } = useWishlist()

    const images = product.images?.length
        ? product.images
        : product.image
        ? [product.image, product.image, product.image, product.image]
        : []

    // Auto-rotate thumbnails every 3 seconds
    useEffect(() => {
        if (images.length <= 1) return
        const interval = setInterval(() => {
            setActiveThumb((prev) => (prev + 1) % Math.min(images.length, 4))
        }, 3000)
        return () => clearInterval(interval)
    }, [images.length])

    const addToCart = async () => {
        try {
            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
            })
            if (res.ok) {
                updatedCart()
                setAddedToBag(true)
                setTimeout(() => setAddedToBag(false), 2000)
            }
        } catch (error) {
            console.error("ADD_TO_CART_ERROR:", error)
        }
    }

    const handleWishlist = async () => {
        if (!session) {
            showDialogue({ id: product.id, name: product.name, image: product.image }, false)
            return
        }
        try {
            if (wishlisted) {
                await fetch("/api/wishlist/remove", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id }),
                })
                setWishlisted(false)
            } else {
                await fetch("/api/wishlist/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id }),
                })
                setWishlisted(true)
                showDialogue({ id: product.id, name: product.name, image: product.image }, true)
            }
        } catch (error) {
            console.error("WISHLIST_ERROR:", error)
        }
    }

    const handleMouseCursor = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return
        const rectangle = imageRef.current.getBoundingClientRect()
        const x = ((e.clientX - rectangle.left) / rectangle.width) * 100
        const y = ((e.clientY - rectangle.top) / rectangle.height) * 100
        setZoomPosition({ x, y })
    }

    const toggle = (label: string) =>
        setOpenDropdown(openDropdown === label ? null : label)

    const currentImage = images[activeThumb] ?? product.image

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

                    {/* Main Image with Zoom */}
                    <div
                        ref={imageRef}
                        className="relative aspect-square rounded-2xl overflow-hidden glass cursor-zoom-in"
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                        onMouseMove={handleMouseCursor}
                    >
                        {currentImage ? (
                            <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300"
                                style={{
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                    transform: isZoomed ? "scale(1.6)" : "scale(1)",
                                }}
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
                                onClick={() => setActiveThumb(i)}
                                className={`aspect-square rounded-xl overflow-hidden glass cursor-pointer transition-all ${
                                    activeThumb === i
                                        ? "ring-2 ring-lumea-rose-500"
                                        : "hover:ring-2 hover:ring-lumea-rose-400"
                                }`}
                            >
                                {images[i] ? (
                                    <Image
                                        src={images[i]}
                                        alt={`${product.name} view ${i + 1}`}
                                        width={120}
                                        height={120}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-lumea-rose-100 to-lumea-rose-200 flex items-center justify-center">
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
                            onClick={addToCart}
                            className={`flex-1 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                                addedToBag
                                    ? "bg-green-500 scale-95"
                                    : "bg-lumea-rose-500 hover:bg-lumea-rose-600"
                            }`}
                        >
                            {addedToBag ? "✓ Added to Bag!" : "Add to Bag"}
                        </button>
                        <button
                            onClick={handleWishlist}
                            className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-lumea-rose-50 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                className="transition-all duration-200"
                                fill={wishlisted ? "#c81e6c" : "none"}
                                stroke="#c81e6c"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
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
                                        {label === "Product Description" ? product.description : content}
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