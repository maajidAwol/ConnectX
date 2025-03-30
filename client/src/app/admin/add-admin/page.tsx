"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function AddAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "New administrator has been added successfully.",
      })
      setIsLoading(false)
      router.push("/admin/users")
    }, 1500)
  }

  return (
    <DashboardLayout title="Add Administrator" description="Create a new administrator account" role="admin">
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
                <Input id="fullName" placeholder="John Doe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select id="role" className="w-full p-2 border rounded-md" defaultValue="admin">
                  <option value="admin">System Administrator</option>
                  <option value="superadmin">Super Administrator</option>
                </select>
              </div>

              <div className="space-y-2">
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
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/admin/users")} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
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
    </DashboardLayout>
  )
}

