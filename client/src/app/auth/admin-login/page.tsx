"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3 } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/admin/dashboard`)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              E
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Administrator Login</CardTitle>
          <CardDescription className="text-center">Sign in to access the system administration panel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" placeholder="admin@example.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password">Password</Label>
                <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="admin-password" type="password" />
            </div>
            <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-primary hover:underline">
              Back to regular login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

