"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { LogOut, Settings, Heart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/real-timeCart"


interface SessionUser
{
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
}

export default function Navbar()
{
    const { data: session } = useSession()
    const user = session?.user as SessionUser | undefined
    const isAdmin = user?.role === "ADMIN"
    const { cartCount } = useCart()

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-8">

                    {/* Logo + Nav Tabs grouped together on the left side of the page. */}
                    <div className="flex items-center gap-20">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold lumea-text-gradient font-heading">
                                LUMEA
                            </span>
                        </Link>

                    {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                                Home
                            </Link>
                            <Link href="/shop" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                                Shop
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                                About
                            </Link>
                            <Link href="/contact" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                                Contact
                            </Link>
                    </div>
                </div>

                    {/* Right Side: Search + Icons */}
                    <div className="flex items-center gap-4">

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 bg-white/60 border border-lumea-rose-100 rounded-full px-4 py-2">
                            {/* <Search size={}></Search>  finish this line */}
                        </div>

                        {session ? (
                            <div className="flex items-center gap-3">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-1 text-sm font-medium text-lumea-rose-600 hover:text-lumea-rose-700 transition-colors"
                                    >
                                        <Settings size={16} />
                                        Admin
                                    </Link>
                                )}

                                {/* Shopping Cart Icon */}
                                <Link href="/cart" className="relative">
                                    <Image src="/icons/bags-shopping.svg" alt="Cart" width={24} height={24} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-lumea-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>



                                {/* Wishlist Icon */}
                                <Link
                                    href="/wishlist" className="relative text-foreground/70 hover:text-lumea-rose-600 transition-colors">
                                    <Image src="/icons/heart.svg" alt="Heart" width={24} height={24} />
                                </Link>

                                {/* User Account Profile */}
                                <Link href="/account" className="text-foreground/70 hover:text-lumea-rose-600 transition-colors">
                                    <Image src="/icons/admin-alt.svg" alt="Account" width={24} height={24} />
                                </Link>

                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="lumea-button px-4! py-2! text-sm!"
                                >
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