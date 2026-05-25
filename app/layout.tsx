import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import AnnouncementBar from "@/components/layout/AnnouncementBar"
import Navbar from "@/components/layout/Navbar"
import Providers from "@/components/layout/Providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const playfair = Playfair_Display({ variable: "--font-heading", subsets: ["latin"] })

export const metadata: Metadata =
{
    title: "Lumea | Luxury Perfumes",
    description: "Discover Lumea's exclusive collection of luxury perfumes.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>)
{
    return (
        <html
            lang="en"
            className={cn(
                "h-full antialiased",
                geistSans.variable,
                geistMono.variable,
                inter.variable,
                playfair.variable
            )}
        >
            <body className="min-h-full flex flex-col">
                <Providers>
                    <AnnouncementBar />
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    )
}