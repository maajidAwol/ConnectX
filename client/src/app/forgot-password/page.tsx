"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { Logo } from "@/components/logo"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("https://connectx-9agd.onrender.com/api/auth/password-reset-request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast.success("Password reset email sent successfully!", {
          className: "bg-[#02569B] text-white",
        })
        setShowSuccessMessage(true)
        setEmail("")
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to send password reset email", {
          className: "bg-red-500 text-white",
        })
      }
    } catch (error) {
      toast.error("Failed to send password reset email", {
        className: "bg-red-500 text-white",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccessMessage) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Toaster position="top-center" richColors />
        <Card className="w-full max-w-md">
          <div className="flex justify-center items-center py-4">
            <Logo />
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>
              We've sent you a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to {email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your email and click the link to reset your password.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowSuccessMessage(false)}
                className="w-full"
              >
                Back to Forgot Password
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Toaster position="top-center" richColors />
      <Card className="w-full max-w-md">
        <div className="flex justify-center items-center py-4">
          <Logo />
        </div>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button className="w-full bg-[#02569B] hover:bg-[#02569B]/90" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
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