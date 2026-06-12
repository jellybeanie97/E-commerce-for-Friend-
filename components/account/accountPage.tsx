"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Eye, EyeOff } from "lucide-react"

export default function AccountPage()
{
    const { data: session, update } = useSession()
    const user = session?.user
    const nameParts = user?.name?.split(" ") ?? []

    const [firstName, setFirstName] = useState(nameParts[0] ?? "")
    const [lastName, setLastName] = useState(nameParts[1] ?? "")
    const [email, setEmail] = useState(user?.email ?? "")
    const [phone, setPhone] = useState("")
    const [dob, setDob] = useState("")
    const [infoSuccess, setInfoSuccess] = useState("")
    const [infoError, setInfoError] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passSuccess, setPassSuccess] = useState("")
    const [passError, setPassError] = useState("")

    useEffect(() => {
        fetch("/api/account")
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (!data) return
                const parts = data.name?.split(" ") ?? []
                setFirstName(parts[0] ?? "")
                setLastName(parts[1] ?? "")
                setEmail(data.email ?? "")
                setPhone(data.phone ?? "")
                setDob(data.dob ? new Date(data.dob).toISOString().split("T")[0] : "")
            })
            .catch((err) => console.error("FETCH_ACCOUNT_ERROR:", err))
    }, [])

    const handleInfoUpdate = async () => {
        setInfoSuccess("")
        setInfoError("")
        try {
            const res = await fetch("/api/account/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, phone, dob })
            })
            if (res.ok) {
                await update()
                setInfoSuccess("Your personal info has been updated successfully!")
            } else {
                const data = await res.json()
                setInfoError(data.error ?? "An error occurred.")
            }
        } catch {
            setInfoError("An error occurred.")
        }

        const passwordRequirements = [
            { label: "10 characters", met: newPassword.length >= 10 },
            { label: "1 uppercase letter", met: /[A-Z]/.test(newPassword) },
            { label: "1 symbol", met: /[^a-zA-Z0-9]/.test(newPassword) },
            { label: "1 number", met: /[0-9]/.test(newPassword) },
            { label: "1 lowercase letter", met: /[a-z]/.test(newPassword) },
        ]

        const handlePasswordUpdate = async () => {
            setPassSuccess("")
            setPassError("")
            if (newPassword !== confirmPassword) {
                setPassError("Passwords do not match. Please try again.")
                return
            }
            if (!passwordRequirements.every((r) => r.met)) {
                setPassError("Password does not meet all requirements.")
                return
            }
            try {
                const res = await fetch("/api/account/update", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ currentPassword, newPassword }),
            })
            if (res.ok) {
                setPassSuccess("Your password has been updated successfully!")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            } else {
                const data = await res.json()
                setPassError(data.error ?? "An error occurred.")
            }
        } catch {
            setPassError("An error occurred.")
        }
    }

    return (
        <>
            {/* Account Settings Tab */}
            <div className="glass rounded-2xl p-6">
                <h2 className="font-heading font-bold text-xl text-lumea-rose-600 underline mb-6">
                    My Personal Info:
                </h2>
                <div className="flex flex-col lg:flex-row gap-9">

                {/* Left - Current Info */}
                <div className="flex flex-col gap-3 lg:w-56 shrink-0 text-sm">
                    <div>
                        <span className="text-xs text-foreground/40">First:</span>
                        <p className="font-medium">{firstName || "-"}</p>
                    </div>
                    <div>
                        <span className="text-xs text-foreground/40">Last:</span>
                        <p className="font-medium">{lastName || "-"}</p>
                    </div>
                    <div>
                        <span className="text-xs text-foreground/40">Current Email:</span>
                        <p className="font-medium">{email || "-"}</p>
                    </div>
                    <div>
                        <span className="text-xs text-foreground/40">Phone:</span>
                        <p className="font-medium">{phone || "-"}</p>
                    </div>
                    <div>
                        <span className="text-xs text-foreground/40">Date of Birth:</span>
                        <p className="font-medium">
                            {dob ? new Date(dob).toLocaleDateString("en-US", { month: "long", day: "numeric" }) :  "-"}
                        </p>
                    </div>
                </div>

                {/* Right - Edit Fields */}
                <div className="flex-1 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-foreground/40 px-1">First Name</label>
                            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="glass rounded-xl px-4 py-2 text-sm outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-foreground/40 px-1">Last Name</label>
                            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="glass rounded-xl px-4 py-2 text-sm outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-foreground/40 px-1">Email Address</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="glass rounded-xl px-4 py-2 text-sm outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-foreground/40 px-1">Date of Birth</label>
                            <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" className="glass rounded-xl px-4 py-2 text-sm outline-none" />
                            <p className="text-xs text-foreground/40 px-1">Enter this to receive a birthday gift! 🎁</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-foreground/40 px-1">Phone Number</label>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="glass rounded-xl px-4 py-2 text-sm outline-none" />
                        </div>
                    </div>
                    {infoSuccess && <p className="text-xs text-green-500">{infoSuccess}</p>}
                    {infoError && <p className="text-xs text-red-400">{infoError}</p>}
                    <div className="flex justify-end">
                        <button onClick={handleInfoUpdate} className="bg-lumea-rose-500 hover:bg-lumea-rose-600 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors">
                            UPDATE
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Update Password */}
        <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-heading font-bold text-xl text-lumea-rose-600 underline">
                Update Password:
            </h2>
            <div className="flex items-center glass rounded-xl overflow-hidden">
                <input type={showCurrent ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password:" className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-foreground/30" />
                <button onClick={() => setShowNew(!showNew)} className="px-3 text-foreground/40 hover:text-foreground/70">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <p className="text-xs text-foreground/40 col-span-2">Must contain the following:</p>
                {passwordRequirements.map((req) => (
                    <p key={req.label} className={`text-xs ${req.met ? "text-green-500" : "text-foreground/40"}`}>
                        • {req.label}
                    </p>
                ))}
            </div>
            <div className="flex items-center glass rounded-xl overflow-hidden">
                <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password:" className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-foreground/30" />
                <button onClick={() => setShowConfirm(!showConfirm)} className="px-3 text-foreground/40 hover:text-foreground/70">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {passSuccess && <p className="text-xs text-green-500">{passSuccess}</p>}
            {passError && <p className="text-xs text-red-400">{passError}</p>}
            <div className="flex justify-end">
                <button onClick={handlePasswordUpdate} className="bg-lumea-rose-500 hover:bg-lumea-rose-600 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors">
                    UPDATE
                </button>
            </div>
        </div>
       </>
        )
    }
}