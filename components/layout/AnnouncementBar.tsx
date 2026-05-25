export default function AnnouncementBar()
{
    return (
        <div className="bg-lumea-rose-600 text-white py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-12 text-xs font-medium tracking-wide">
                <span>✦ Get 10% off your first order — use code LUMEA10 ✦</span>
                <span className="hidden md:block"></span>
                <span className="hidden md:block">✦ Free Shipping on orders over $65 ✦</span>
            </div>
        </div>
    )
}