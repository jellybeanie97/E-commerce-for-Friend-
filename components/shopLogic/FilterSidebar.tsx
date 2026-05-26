"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"


const filters = [
    {
        label: "For Her",
        options: ["Floral", "Sweet", "Fresh", "Oriental"]
    },
    {
        label: "For Him",
        options: ["Woody", "Spicy", "Fresh", "Aquatic"]
    },
    {
        label: "Unisex",
        options: ["Citrus", "Mellow", "Earthy", "Aromatic"]
    },
    {
        label: "Scent Family",
        options: ["Floral", "Woody", "Fresh", "Oriental", "Citrus", "Mellow"]
    },
    {
        label:"Price Range",
        options: ["Clearance (under $30)", "$30 - $60", "$60 - $100", "Over $100"]
    },
]

interface FilterSectionProps
{
    label: string
    options: string[]
}

function FilterSection({ label, options }: FilterSectionProps)
{
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<string[]>([])

    const toggleOption = (option: string) =>
    {
        setSelected(prev =>
        {
            if (prev.includes(option))
            {
                return prev.filter((o: string) => o !== option)
            }
            return [...prev, option]
        })
    }

    return (
        <div className="border-b border-lumea-rose-100 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                    {label}
                    <ChevronDown
                        size={16}
                        className={'transition-transform duration-200 ${isOpen ? "rotate-180" : ""}'}
                    />
                </button>
                {isOpen && (
                    <div className="mt-3 flex flex-col gap-2">
                        {options.map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => toggleOption(option)}
                                    className="accent-lumea-rose-600"
                                />
                                <span className="text-sm text-foreground/60">{option}</span>
                            </label>
                        ))}
                    </div>
                )}
        </div>
    )
}

export default function FilterSidebar()
{
    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground/50 mb-4">
                Filter
            </h3>
            {filters.map((filter) => (
                <FilterSection
                    key={filter.label}
                    label={filter.label}
                    options={filter.options}
                />
            ))}
        </div>
    )
}