import Link from "next/link";

export default function ProductCards()
{
    return (
        <section className="py-20 px-4 max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
                <p className="text-lumea-rose-600 text-xs font-medium tracking-[0.3em] uppercase mb-3">
                    Our Collection
                </p>
                <h2 className="text-4xl font-heading font-bold">
                    Featured Fragrances
                </h2>
            </div>

        {/* Placeholder for showcasing products.. will add more later */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                        <div className="aspect-square bg-gradient-to-br from-lumea-rose-100 to-lumea-rose-200 flex items-center justify-center">
                            <span className="text-6xl">🌸</span>
                        </div>
                        <div className="p-6">
                            <h3 className="font-heading text-xl font-bold mb-1">
                                Lumea No. {i}
                            </h3>
                            <p className="text-sm text-foreground/60 mb-4">
                                A captivating blend of floral and woody notes
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-lumea-rose-600">
                                    $30.00
                                </span>
                                <Link
                                    href="/shop"
                                    className="text-sm font-medium text-lumea-rose-600 hover:text-lumea-rose-700 transition-colors"
                                >
                                    View →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="">
                <Link href="/shop" className="lumea-button">
                    View All Fragrances
                </Link>
            </div>
        </section>
            
    );
} 