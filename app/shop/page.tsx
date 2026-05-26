import FilterSidebar from "@/components/shopLogic/FilterSidebar"
import SortBar from "@/components/shopLogic/SortBar"
import ProductGrid from "@/components/shopLogic/ProductGrid"


export default function ShopPage() 
{ 
    return (
        <div className="min-h-screen">

            {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-8 py-4 mt-2">
            <p className="text-sm text-foreground/50">
                <span>Home</span>
                <span className="mx-2">|</span>
                <span className="text-foreground/80 font-medium">Shop</span>
            </p>
        </div>

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-8 pb-12 flex gap-8">

            {/* Filter Sidebar */}
            <aside className="hidden md:block w-64 shrink-0 pt-14">
                <FilterSidebar />
            </aside>

            {/* Product Grid + Sort */}
            <div className="flex-1 min-w-0">
                <SortBar />
                <ProductGrid />
            </div>

        </div>
    </div>
    )
}

