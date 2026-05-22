export default function ShowcaseStrip()
{
    return (
        <section className="border-y border-lumea-rose-100 py-6 bg-white/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { icon: "✦", label: "Natural Ingredients" },
                        { icon: "🌸", label: "Handcrafted Blends" },
                        { icon: "✉", label: "Free Shipping over $50" },
                        { icon: "♡", label: "Made with Love" },
                    ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-xs font-medium text-foreground/60 tracking-wide uppercase">
                            {item.label}
                        </span>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
