"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Search } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/real-timeCart"
import { useWishlist } from "@/lib/wishlistContext"

interface SessionUser {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
}

export default function Navbar() {
    const { data: session } = useSession()
    const user = session?.user as SessionUser | undefined
    const isAdmin = user?.role === "ADMIN"
    const { cartCount } = useCart()
    const { dialogueState, hideDialogue } = useWishlist()

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-8">

                    {/* Logo + Nav Tabs */}
                    <div className="flex items-center gap-14">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold lumea-text-gradient font-heading">
                                LUMEA
                            </span>
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Home</Link>
                            <Link href="/shop" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Shop</Link>
                            <Link href="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">About</Link>
                            <Link href="/contact" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Contact</Link>
                        </div>
                    </div>

                    {/* Right Side: Search + Icons */}
                    <div className="flex items-center gap-4">

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 bg-white/60 border border-lumea-rose-100 rounded-full px-4 py-2 mr-6">
                            <Search size={16} className="text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent text-sm outline-none w-40 placeholder:text-foreground/40"
                            />
                        </div>

                        {session ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link href="/admin" className="flex items-center gap-1 text-sm font-medium text-lumea-rose-600 hover:text-lumea-rose-700 transition-colors">
                                        <Image src="/icons/admin-alt.svg" alt="Admin" width={20} height={20} />
                                    </Link>
                                )}

                                <div className="flex items-center gap-2">

                                    {/* Shopping Cart Icon */}
                                    <Link href="/cart" className="relative">
                                        <Image src="/icons/bags-shopping.svg" alt="Cart" width={24} height={24} />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-lumea-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Account */}
                                    <Link href="/account">
                                        <Image src="/icons/user.svg" alt="Account" width={24} height={24} />
                                    </Link>

                                    {/* Wishlist Icon + Dialogue Box */}
                                    <div className="relative">
                                        <Link href="/wishlist" className="relative text-foreground/70 hover:text-lumea-rose-600 transition-colors block">
                                            <Image src="/icons/heart.svg" alt="Heart" width={24} height={24} />
                                        </Link>

                                        {/* Dialogue Box */}
                                        {dialogueState.visible && (
                                            <div className="absolute right-0 top-10 w-64 glass rounded-2xl shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <button
                                                    onClick={hideDialogue}
                                                    className="absolute top-2 right-3 text-foreground/30 hover:text-foreground/60 text-xs"
                                                >
                                                    ✕
                                                </button>

                                                {dialogueState.isLoggedIn ? (
                                                    /* Logged in — show product added */
                                                    <div className="flex items-center gap-3">
                                                        {dialogueState.product?.image && (
                                                            <Image
                                                                src={dialogueState.product.image}
                                                                alt={dialogueState.product.name ?? ""}
                                                                width={48}
                                                                height={48}
                                                                className="rounded-xl object-cover w-12 h-12"
                                                            />
                                                        )}
                                                        <p className="text-sm font-medium">
                                                            <span className="text-lumea-rose-600 font-bold">{dialogueState.product?.name}</span>
                                                            {" "}has been added to your wishlist!
                                                        </p>
                                                    </div>
                                                ) : (
                                                    /* Not logged in — prompt to create account */
                                                    <div className="space-y-2 text-center">
                                                        <p className="text-sm text-foreground/70">
                                                            Save items to your wishlist by creating an account!
                                                        </p>
                                                        <Link
                                                            href="/auth/signup"
                                                            className="block w-full bg-lumea-rose-500 hover:bg-lumea-rose-600 text-white text-sm font-bold py-2 rounded-xl transition-colors text-center"
                                                            onClick={hideDialogue}
                                                        >
                                                            Create an Account
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Greeting */}
                                <span className="text-sm font-medium text-foreground/70">
                                    Hello, {user?.name?.split(" ")[0]}!
                                </span>
                            </div>

                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/auth/login" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/auth/signup" className="lumea-button px-4! py-2! text-sm!">
                                    Join Lumea
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}