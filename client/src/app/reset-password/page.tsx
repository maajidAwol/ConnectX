"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { Logo } from "@/components/logo"
import { Lock } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  })

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (!tokenParam) {
      toast.error("Invalid or missing reset token", {
        className: "bg-red-500 text-white",
      })
      router.push("/login")
    } else {
      setToken(tokenParam)
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match", {
        className: "bg-red-500 text-white",
      })
      return
    }

    if (!token) {
      toast.error("Invalid reset token", {
        className: "bg-red-500 text-white",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://connectx-9agd.onrender.com/api/auth/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: formData.new_password,
        }),
      })

      if (response.ok) {
        toast.success("Password has been reset successfully!", {
          className: "bg-[#02569B] text-white",
        })
        router.push("/login")
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to reset password", {
          className: "bg-red-500 text-white",
        })
      }
    } catch (error) {
      toast.error("Failed to reset password", {
        className: "bg-red-500 text-white",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Toaster position="top-center" richColors />
      <Card className="w-full max-w-md">
        <div className="flex justify-center items-center py-4">
          <Logo />
        </div>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                name="new_password"
                type="password"
                placeholder="Enter your new password"
                value={formData.new_password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
            <Button className="w-full bg-[#02569B] hover:bg-[#02569B]/90" type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-[#02569B] hover:underline">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 