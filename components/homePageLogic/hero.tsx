import Link from "next/link";


export default function Hero()
{
    return (
        <div className="flex flex-col">
            {/* Hero Section of the Website */}

            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 lumea-gradient opacity-10" />
                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <p className="text-lumea-rose-600 text-sm font-medium tracking-[0.3em] uppercase mb-6 sparkle">
                            Natural Perfumes 
                        </p>
                        <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 leading-tight">
                            Discover Your
                            <span className="lumea-text-gradient block">
                                Signature Scent
                            </span>
                        </h1>
                        <p className="text-lg text-foreground/60 mb-10 max-w-xl mx-auto leading-relaxed">
                            Each Lumea fragrance is crafted to tell your story.
                            Find the scent that speaks to your soul.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/shop" className="lumea-button">
                                Shop Collection
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors underline underline-offset-4"
                            >
                                Our Story
                            </Link>
                        </div>
                    </div>
            </section>
        </div>
    );
}