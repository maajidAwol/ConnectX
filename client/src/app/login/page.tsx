"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { Logo } from "@/components/logo"
import { Mail, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const resendVerification = useAuthStore((state) => state.resendVerification)
  const getRedirectPath = useAuthStore((state) => state.getRedirectPath)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData)
      const user = useAuthStore.getState().user

      // Create custom success message based on role
      const successMessage =
        user?.role === "admin"
          ? "Welcome admin! Redirecting to admin dashboard..."
          : "Welcome back! Redirecting to dashboard..."

      toast.success(successMessage, {
        className: "bg-[#02569B] text-white",
      })

      const redirectPath = getRedirectPath()
      router.push(redirectPath)
    } catch (error: any) {
      // Check if error is due to unverified email
      if (error.message?.includes("verify your email")) {
        setUnverifiedEmail(formData.email)
        setShowVerificationPrompt(true)
        // Don't show error toast for unverified email
      } else {
        toast.error("Invalid email or password. Please try again.", {
          className: "bg-red-500 text-white",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return

    setIsResending(true)
    try {
      await resendVerification(unverifiedEmail)
      toast.success("Verification email sent successfully!", {
        className: "bg-[#02569B] text-white",
      })
      setShowVerificationPrompt(false)
    } catch (error) {
      toast.error("Failed to resend verification email", {
        className: "bg-red-500 text-white",
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (showVerificationPrompt) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Toaster position="top-center" richColors />
        <Card className="w-full max-w-md">
          <div className="flex justify-center items-center py-4">
            <Logo />
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
            <CardDescription>Please verify your email address to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">We've sent a verification link to {unverifiedEmail}</p>
                <p className="text-sm text-muted-foreground">
                  Please check your email and click the verification link to activate your account.
                </p>
              </div>
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-blue-700 hover:bg-blue-800"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>
              <Button variant="outline" onClick={() => setShowVerificationPrompt(false)} className="w-full">
                Back to Login
              </Button>
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
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
