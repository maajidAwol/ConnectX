"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { simulateLogin, simulateRegister } from "@/lib/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [company, setCompany] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const router = useRouter()
  const searchParams = useSearchParams()

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [searchParams])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Simulate login with our auth utility
    const result = simulateLogin(loginEmail, loginPassword)

    if (result.success) {
      // In a real app, we would store the user in a context or cookie
      // For demo, we'll just redirect to the appropriate dashboard
      router.push(result.redirectUrl)
    } else {
      setError(result.message)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!firstName || !lastName || !registerEmail || !registerPassword || !company) {
      setError("All fields are required")
      return
    }

    // Simulate registration with our auth utility
    const result = simulateRegister(registerEmail, registerPassword, firstName, lastName, company)

    if (result.success) {
      // In a real app, we would store the user in a context or cookie
      // For demo, we'll just redirect to the appropriate dashboard
      router.push(result.redirectUrl)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-700 flex flex-col">
      <div className="container py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-white/90">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">ConnectX</h1>
            <p className="mt-2 text-white/80">Access your e-commerce backend</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember" className="rounded border-gray-300" />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        Remember me
                      </Label>
                    </div>
                    <Link href="#" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Login
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>Demo accounts:</p>
                    <p>Admin: admin@connectx.com (any password)</p>
                    <p>Merchant: merchant@example.com (any password)</p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="rounded border-gray-300" required />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I agree to the{" "}
                      <Link href="#" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Account
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>For demo purposes:</p>
                    <p>Use "admin" in email to create admin account</p>
                    <p>Otherwise, a merchant account will be created</p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
