import Link from "next/link";

export default function AboutLumea()
{
    return (
        <section className="py-20 px-4 bg-white/40">
            <div className="max-w-4xl mx-auto text-center">
                <p className="text-lumea-rose-600 text-xs font-medium tracking-[0.3em] uppercase mb-3">
                    Our Story
                </p>
                <h2 className="text-4xl font-heading font-bold mb-6">
                    Born from a Passion for Fragrance
                </h2>
                <p className="text-foreground/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                    Lumea was created for those who believe that a scent is more than
                    just a fragrance - it is a memory, an emotion, a statement.
                    Every bottle tells a story.
                </p>
                <Link
                    href="/about"
                    className="text-sm font-medium text-lumea-rose-600 hover:text-lumea-rose-700 transition-colors underline underline-offset-4"
                >
                    Learn more about us →
                </Link>
            </div>
        </section>
    );
}