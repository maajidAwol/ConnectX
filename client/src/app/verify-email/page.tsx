"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { Logo } from "@/components/logo"
import { CheckCircle2, XCircle, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [inputEmail, setInputEmail] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      if (!token) {
        setVerificationStatus('error')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email/?token=${token}`, {
          headers: {
            'accept': 'application/json'
          }
        })
        const data = await response.json()

        if (response.ok) {
          setVerificationStatus('success')
          // Extract email from token for potential resend
          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]))
            setEmail(tokenData.email)
          } catch (e) {
            console.error('Error parsing token:', e)
          }
        } else {
          setVerificationStatus('error')
          if (data.email) {
            setEmail(data.email)
          }
        }
      } catch (error) {
        setVerificationStatus('error')
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleResendVerification = async () => {
    const emailToUse = email || inputEmail
    if (!emailToUse) {
      toast.error("Please enter your email address", {
        className: "bg-red-500 text-white",
      })
      return
    }

    setIsResending(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify({ email: emailToUse }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Verification email sent successfully!", {
          className: "bg-[#02569B] text-white",
        })
        setEmail(emailToUse)
      } else {
        if (response.status === 400) {
          toast.error("Email already verified or invalid input", {
            className: "bg-red-500 text-white",
          })
        } else if (response.status === 404) {
          toast.error("User not found", {
            className: "bg-red-500 text-white",
          })
        } else {
          toast.error(data.message || "Failed to resend verification email", {
            className: "bg-red-500 text-white",
          })
        }
      }
    } catch (error) {
      toast.error("Failed to resend verification email", {
        className: "bg-red-500 text-white",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Toaster position="top-center" richColors />
        <Card className="w-full max-w-md">
          <div className="flex justify-center items-center py-4">
            <Logo />
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Verifying your email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02569B]"></div>
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
          <CardTitle className="text-2xl font-bold">
            {verificationStatus === 'success' ? 'Email Verified' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {verificationStatus === 'success' 
              ? 'Your email has been successfully verified'
              : 'The verification link is invalid or has expired'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className={`rounded-full p-3 ${
              verificationStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {verificationStatus === 'success' ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="text-center space-y-2">
              {verificationStatus === 'success' ? (
                <p className="text-sm text-muted-foreground">
                  You can now log in to your account
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {email 
                    ? `Would you like to resend the verification email to ${email}?`
                    : 'Please enter your email to resend the verification link'}
                </p>
              )}
            </div>
            {verificationStatus === 'success' ? (
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-[#02569B] hover:bg-[#02569B]/90"
              >
                Go to Login
              </Button>
            ) : (
              <div className="w-full space-y-4">
                {!email && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      required
                    />
                  </div>
                )}
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full bg-[#02569B] hover:bg-[#02569B]/90"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 