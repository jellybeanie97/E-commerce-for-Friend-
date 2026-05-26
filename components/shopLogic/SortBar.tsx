"use client"

import { useState } from "react"

const sortOptions = ["Recommended", "Best Selling", "Price: Low to High", "Price: High to Low"]

export default function SortBar()
{
    const [selected, setSelected] = useState("Recommende")

    return (
        <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-foreground/100">
                Showing all Fragrances
            </p>
            <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-foreground/100">Sort by:</span>
                    <select
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                        className="text-sm bg-white/60 border border-lumea-rose-100 rounded-full px-4 py-2 outline-none cursor-pointer"
                    >
                        {sortOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
            </div>
        </div>
    )
}