"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Product
{
    id: string
    name: string
    description: string | null
    image: string | null
    price: number
    priceId: string | null
}


export default function ProductGridView()
{
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>
    {
        const fetchProducts = async () =>
        {
            try
            {
                const res = await fetch("/api/products")
                const data = await res.json()
                setProducts(data)
            }
            catch (error)
            {
                console.error("Failed to fetch products:", error)
            }
            finally
            {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading)
    {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                        <div className="aspect-square bg-lumea-rose-100" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-lumea-rose-100 rounded w-3/4" />
                            <div className="h-3 bg-lumea-rose-100 rounded w-full" />
                            <div className="h-4 bg-lumea-rose-100 rounded w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-4 gap-6">
            {products.map((product) => (
                <div key={product.id} className="glass rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">

                    {/* Product Image */}
                    <div className="relative aspect-square bg-linear-to-br from-lumea-rose-100 to-lumea-rose-200 flex items-center justify-center">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-6xl">🌸</span>
                        )}

                        {/* Wishlist Button */}
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/95 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="30"
                                viewBox="0 0 24 24"
                                className="heart-icon transition-all duration-200"
                                fill="none"
                                stroke="#c81e6c"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                        <h3 className="font-heading text-lg font-bold mb-1">
                            {product.name}
                        </h3>
                        <p className="text-xs text-foreground/50 mb-3 line-clamp-2">
                            {product.description ?? "A luxurious Lumea Fragrance"}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-lumea-rose-600">
                                ${product.price.toFixed(2)}
                            </span>
                            <Link
                                href={`/shop/${product.id}`}
                                className="text-xs font-medium text-lumea-rose-600 hover:text-lumea-rose-700 transition-colors"
                            >
                                View →
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

}

