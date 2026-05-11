"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { LogOut, Settings } from "lucide-react"

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

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold lumea-text-gradient font-heading">
                            LUMEA
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
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

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
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
                                <span className="text-sm text-foreground/70">
                                    {user?.name}
                                </span>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground transition-colors"
                                >
                                    <LogOut size={16} />
                                </button>
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