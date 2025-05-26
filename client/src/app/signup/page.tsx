"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { Mail, Check, X, Loader2, Eye, EyeOff } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PasswordValidation {
  hasMinLength: boolean
  hasLetter: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export default function SignUpPage() {
  const router = useRouter()
  const { signup, isLoading, error, clearError, resendVerification } = useAuthStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    fullname: "",
    age: null as number | null,
    gender: "male" as "male" | "female",
  })
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false,
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [cooldown, setCooldown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Password validation
    const password = formData.password
    const validations = {
      hasMinLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    setPasswordValidation(validations)

    // Calculate password strength (0-100)
    const criteriaCount = Object.values(validations).filter(Boolean).length
    setPasswordStrength(password.length ? (criteriaCount / 4) * 100 : 0)
  }, [formData.password])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showSuccess && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showSuccess, cooldown])

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const isFormValid = isPasswordValid && 
    formData.name && 
    formData.email && 
    formData.fullname && 
    formData.age && 
    formData.gender

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-orange-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!isFormValid) {
      toast.error("Please fill in all required fields correctly", {
        className: "bg-red-500 text-white",
      })
      return
    }

    try {
      await signup(formData)
      toast.success("Account created successfully! Please check your email for verification.", {
        className: "bg-[#02569B] text-white",
        duration: 5000,
      })
      setShowSuccess(true)
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.name?.includes("already exists")) {
          toast.error("This company name is already taken. Please choose another one.", {
            className: "bg-red-500 text-white",
          })
        } else if (errorData.email?.includes("already exists")) {
          toast.error("This email is already registered. Please use a different email or try logging in.", {
            className: "bg-red-500 text-white",
          })
        } else {
          toast.error("Failed to create account. Please try again.", {
            className: "bg-red-500 text-white",
          })
        }
      } else {
        toast.error("Failed to create account. Please try again.", {
          className: "bg-red-500 text-white",
        })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value ? parseInt(value) : null) : value
    }))
  }

  const handleResendVerification = async () => {
    try {
      await resendVerification(formData.email)
      toast.success("Verification email sent successfully!", {
        className: "bg-[#02569B] text-white",
      })
      setCooldown(60)
      setCanResend(false)
    } catch (error) {
      toast.error("Failed to resend verification email", {
        className: "bg-red-500 text-white",
      })
    }
  }

  if (showSuccess) {
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
              We've sent a verification link to {formData.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Please check your email and click the verification link to activate your account.
                  The link will expire in 1 hour.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you don't see the email, check your spam folder or click the resend button below.
                </p>
              </div>
              <Button
                onClick={handleResendVerification}
                disabled={!canResend}
                className="w-full bg-[#02569B] hover:bg-[#02569B]/90"
              >
                {canResend ? "Resend Verification Email" : `Resend in ${cooldown}s`}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Return to login
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
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your company name"
                value={formData.name}
                onChange={handleChange}
                required
                className={error?.includes("name") ? "border-red-500" : ""}
              />
              {error?.includes("name") && (
                <p className="text-sm text-red-500">This company name is already taken</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>
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
                className={error?.includes("email") ? "border-red-500" : ""}
              />
              {error?.includes("email") && (
                <p className="text-sm text-red-500">This email is already registered</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age ? formData.age.toString() : ""}
                  onChange={handleChange}
                  required
                  min="18"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "male" | "female") => 
                    setFormData(prev => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  minLength={8}
                  className={!isPasswordValid && formData.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Password strength</span>
                    <span
                      className={
                        passwordStrength <= 25
                          ? "text-red-500"
                          : passwordStrength <= 50
                            ? "text-orange-500"
                            : passwordStrength <= 75
                              ? "text-yellow-500"
                              : "text-green-500"
                      }
                    >
                      {passwordStrength <= 25
                        ? "Weak"
                        : passwordStrength <= 50
                          ? "Fair"
                          : passwordStrength <= 75
                            ? "Good"
                            : "Strong"}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className={`h-1.5 ${getStrengthColor()}`} />
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div className="flex items-center gap-1">
                      {passwordValidation.hasMinLength ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={passwordValidation.hasMinLength ? "text-green-500" : "text-muted-foreground"}
                      >
                        8+ characters
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordValidation.hasLetter ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={passwordValidation.hasLetter ? "text-green-500" : "text-muted-foreground"}>
                        Letters
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordValidation.hasNumber ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={passwordValidation.hasNumber ? "text-green-500" : "text-muted-foreground"}>
                        Numbers
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordValidation.hasSpecial ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={passwordValidation.hasSpecial ? "text-green-500" : "text-muted-foreground"}>
                        Special chars
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button 
              className="w-full bg-[#02569B] hover:bg-[#02569B]/90" 
              type="submit" 
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-[#02569B] hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}