"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Eye, EyeOff } from "lucide-react"
import PointsPage from "@/components/account/pointsPage";
import OrderTab from "@/components/account/orderPage";
import AddressBookTab from "@/components/account/addressBookPage";

type Tab = "settings" | "points" | "orders" | "address"

export default function AccountPage() {
    
// These are the Account Setting's variables and how it will handle the functions.
    const [activeTab, setActiveTab] = useState<Tab>("settings")

    const tabs: { key: Tab; label: string }[] = [
        { key: "settings", label: "Account Settings" },
        { key: "points", label: "My Points" },
        { key: "orders", label: "Orders" },
        { key: "address", label: "Address Book" },
    ]

    const activeLabel = tabs.find((t) => t.key === activeTab)?.label ?? ""

    return (
        <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto">


            {/* Breadcrumb - the navigation pages */}
            <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-8">
                <Link href="/" className="hover:text-lumea-rose-500 transition-colors">Home</Link>
                <span>|</span>
                <Link href="/shop" className="hover:text-lumea-rose-500 transition-colors">Shop</Link>
                <span>|</span>
                <span>Profile</span>
            </nav>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Sidebar that shows the different tabs to access for the user's settings */}
                <div className="lg:w-64 shrink-0 lg:pt-16">
                    <div className="glass rounded-2xl overflow-hidden flex flex-col">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-5 px-6 text-sm font-semibold text-left transition-colors border-b border-white/10 last:border-0 ${
                                    activeTab === tab.key
                                        ? "bg-lumea-rose-500 text-white"
                                        : "hover:bg-lumea-rose-50 text-foreground/70"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-6">
                    <h1 className="font-heading text-3xl font-bold text-lumea-rose-600 text-center">
                        {activeLabel}
                    </h1>

                    {activeTab === "settings" && <AccountPage />}
                    {activeTab === "points" && <PointsPage />}
                    {activeTab === "orders" && <OrderTab />}
                    {activeTab === "address" && <AddressBookTab />}
                </div>
            </div>
        </div>
    )
}