"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react"
import { useAdminStore } from "@/store/adminStore"
import { Progress } from "@/components/ui/progress"

interface PasswordValidation {
  hasMinLength: boolean
  hasLetter: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export default function AddAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false,
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  })

  const router = useRouter()
  const { createAdmin } = useAdminStore()

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

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const isFormValid = isPasswordValid && formData.name && formData.email && formData.role

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-orange-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await createAdmin(formData)
      toast({
        title: "Success",
        description: "New administrator has been added successfully.",
      })
      router.push("/admin/all-admins")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create administrator",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Administrator</CardTitle>
            <CardDescription>Create a new administrator account with appropriate permissions.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
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
                        <span className={passwordValidation.hasMinLength ? "text-green-500" : "text-muted-foreground"}>
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

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full p-2 border rounded-md"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">System Administrator</option>
                  {/* <option value="superadmin">Super Administrator</option> */}
                </select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="permissions">Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm1" defaultChecked />
                    <label htmlFor="perm1">User Management</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm2" defaultChecked />
                    <label htmlFor="perm2">Merchant Management</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm3" defaultChecked />
                    <label htmlFor="perm3">Platform Settings</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm4" defaultChecked />
                    <label htmlFor="perm4">Analytics Access</label>
                  </div>
                </div>
              </div> */}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Administrator"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

