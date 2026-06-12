"use client"

import { useState, useEffect } from "react"

export default function PointsPage()
{
    const [points, setPoints] = useState(0)
    const [pointsHistory, setPointsHistory] = useState<{ id: string; points: number; reason: string; createdAt: string }[]>([])
    const [memberSince, setMemberSince] = useState("")
    const [instagramAwarded, setInstagramAwarded] = useState(false)
    const [showPointHistory, setShowPointHistory] = useState(false)
    const [showRewardsAppliedHistory, setShowRewardsAppliedHistory] = useState(false)

    useEffect(() => {
        fetch("/api/account/points")
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (!data) return
                setPoints(data.points ?? 0)
                setPointsHistory(data.pointsHistory ?? [])
                setMemberSince(data.createdAt ? new Date(data.createdAt).getFullYear().toString() : "")
                const alreadyFollowed = data.pointsHistory?.some((h: { reason: string }) => h.reason === "Followed on Instagram")
                setInstagramAwarded(alreadyFollowed)
            })
            .catch((err) => console.error("FETCH_POINTS_ERROR:", err))
    }, [])

    const handleInstagramPoints = async () => {
        if (instagramAwarded) return
        const res = await fetch("/api/account/points/instagram", { method: "POST" })
        if (res.ok) {
            setPoints((prev) => prev + 100)
            setInstagramAwarded(true)
            setPointsHistory((prev) => [
                { id: "ig", points: 100, reason: "Followed on Instagram", createdAt: new Date().toISOString() },
                ...prev,
            ])
        }
    }

    return (
        <div className="flex flex-col gap-6">

            {/* This will show the User's points earned and applied */}
            <div className="glass rounded-2xl p-6 space-y-4">
                <div className="flex flex-col lg:flex-row gap-6">

                {/* On the left side: includes member info + points applied buttons */}
                    <div className="flex flex-col gap-3 lg:w-48 shrink-0">
                        <p className="text-sm text-foreground/50">
                            Member since <span className="font-bold text-foreground">{memberSince}</span>
                        </p>
                        <button
                            onClick={() => { setShowPointHistory(!showPointHistory); setShowRewardsAppliedHistory(false) }}
                            className="bg-lumea-rose-500 hover:bg-lumea-rose-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors text-left"
                        >
                            Point History
                        </button>
                        <button
                            onClick={() => { setShowRewardsAppliedHistory(!showRewardsAppliedHistory); setShowPointHistory(false)}}
                            className="bg-lumea-rose-500 hover:bg-lumea-rose-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors text-left"
                        >
                            Reward History
                        </button>
                    </div>

                    {/* Right Side will show the user's progression towards their next reward */}
                    <div className="flex-1 space-y-2">
                        <p className="text-sm font-bold text-lumea-rose-600 text-right">
                            Keep shopping to reach your next $5 reward!
                        </p>
                        <div className="w-full bg-lumea-rose-100 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-lumea-rose-500 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((points / 500) * 100, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-foreground/50">
                            <span>0</span>
                            <span className="font-bold text-lumea-rose-600">{points} pts</span>
                            <span>500</span>
                        </div>
                    </div>
                </div>

                {/* Keeps track of the user's point history */}
                {showPointHistory && (
                    <div className="glass rounded-xl p-4 space-y-2 mt-2">
                        <h3 className="text-sm font-bold text-foreground/70">Point History</h3>
                            {pointsHistory.length === 0 ? (
                                <p className="text-xs text-foreground/40">No points earned yet. Shop to earn points today!</p>
                            ) : (
                                pointsHistory.map((h) => (
                                    <div key={h.id} className="flex justify-between text-xs text-foreground/60">
                                        <span>{h.reason}</span>
                                        <span className="font-bold text-lumea-rose-600">+{h.points} pts</span>
                                    </div>
                                ))
                            )}
                    </div>
                )}

                {/* Displays the user's applied rewards history */}
                {showRewardsAppliedHistory && (
                    <div className="glass rounded-xl p-4 space-y-2 mt-2">
                        <h3 className="text-sm font-bold text-foreground/70">Applied Rewards History</h3>
                        <p className="text-xs text-foreground/40">No rewards applied yet.</p>
                    </div>
                )}
            </div>    
            
            {/* More options for the user to gain points to their account. */}
            <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="font-heading font-bold text-lg text-lumea-rose-600 underline text-center">
                    Want to earn more points?
                </h3>
                <div className="flex flex-col gap-3">

                    {/* Allows the user's to follow the account and receive updates on merch and earn points */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/lumeabeautyllc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleInstagramPoints}
                            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl text-sm transition-colors text-white ${
                                instagramAwarded
                                    ? "bg-gray-400 pointer-events-none"
                                    : "bg-lumea-rose-500 hover:bg-lumea-rose-600"
                            }`}

                        >

                        100 +
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <span className="text-sm text-foreground/70">Follow us on Instagram!</span>
                    {instagramAwarded && <span className="text-xs text-green-500 font-bold">✓ Points Earned!</span>}
                    </div> 

                    {/* Review */}
                    <div className="flex items-center gap-4">
                        <button className="bg-lumea-rose-500 hover:bg-lumea-rose-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                            200 +
                        </button>
                        <span className="text-sm text-foreground/70">Share and Review your Merch!</span>
                    </div>
                </div>
            </div>
        </div>
    )
}