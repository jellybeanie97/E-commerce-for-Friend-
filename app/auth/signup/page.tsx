"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage()
{
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


// Smart handler: updates the correct state key based on input such as 'name'    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        {
            setFormData(prev => ({...prev, [e.target.name]: e.target.value }))
        }

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault()
        setError("")
        setLoading(true)

        try
        {
            // 1. This will validate the logic of the password.

                if (formData.password !== formData.confirmPassword)
                {
                    throw new Error("Passwords do not match")
                }

            // 2. Next it will execute the authentication of the user's password.

                const res = await fetch("/api/auth/register", 
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                    }
                )

                if (!res.ok)
                {
                    const data = await res.json()
                    throw new Error(data.message || "Something went wrong")
                }

                router.push("/auth/login")
        } catch (err)
            {
                setError(err instanceof Error ? err.message : "An error occured")
            } finally {
                setLoading(false)       // Reduced the logic so it can run regardless of success or failure.
            }
        }
    
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl mb-2 font-bold">Create Account</h1>
                        <p className="text-sm text-gray-600">Join Lumea today!</p>
                    </div>
                    <div className="bg-white rounded-2xl p-8 border shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { label: "Name", name: "name", type: "text", placeholder: "Your name" },
                                { label: "Email", name: "email", type: "email", placeholder: "you@example.com"},
                                { label: "Password", name: "password", type: "password", placeholder: "••••••••"},
                                { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••"},
            
                            ].map((field) => 
                            (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                                    <input
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name as keyof typeof formData]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-non transition-all"
                                        placeholder={field.placeholder}
                                        required
                                    />
                                </div>
                        ))}

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors">

                                {loading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>
                        <p className="text-center text-sm mt-6 text-gray-600">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        )
}