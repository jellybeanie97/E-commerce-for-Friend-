"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage()
{
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: ""})
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        {
            setFormData(prev => ({...prev, [e.target.name]: e.target.value }))
        }    

    const handleSubmit = async (e: React.FormEvent) =>
        {
            e.preventDefault()
            setLoading(true)
            setError("")

            try
                {
                    const result = await signIn("credentials", 
                        {
                            ...formData,
                            redirect: false,
                        }
                    )

                    if (result?.error)
                        {
                            throw new Error("Invalid email or password")
                        }

                        router.push("/")
                        router.refresh()
                } catch (err) 
                    {
                        setError(err instanceof Error ? err.message : "An error occured")
                } finally {
                    setLoading(false)
                }
        }


    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl mb-2">Welcome Back</h1>
                    <p className="text-sm">Sign in to your Lumea account</p>
                </div>


                <div className="bg-white rounded-2xl p-8 border shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {(["email", "password"] as const).map((field) => 
                        (
                            <div key={field}>
                                <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                                <input
                                    name={field}
                                    type={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder={field === "email" ? "you@example.com" : "••••••••"}
                                    required
                                />      
                            </div>
                        ))}

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors">

                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <p className="text-center text-sm mt-6">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/signup" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
    )
}