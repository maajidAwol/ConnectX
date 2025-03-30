"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Book,
  Code,
  Compass,
  FileCode,
  HelpCircle,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

const navigation = [
  {
    title: "Dashboard",
    href: "/developer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    href: "/developer/marketplace",
    icon: Compass,
  },
  {
    title: "My Integrations",
    href: "/developer/integrations",
    icon: Code,
  },
  {
    title: "API Explorer",
    href: "/developer/api-explorer",
    icon: Terminal,
  },
  {
    title: "Projects",
    href: "/developer/projects",
    icon: FileCode,
  },
  {
    title: "Documentation",
    href: "/developer/documentation",
    icon: Book,
  },
  {
    title: "Security",
    href: "/developer/security",
    icon: ShieldCheck,
  },
  {
    title: "Settings",
    href: "/developer/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/developer/help",
    icon: HelpCircle,
  },
]

export default function DeveloperCreateAppPage() {
  const [appName, setAppName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateApp = async () => {
    setIsLoading(true)
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false)
      alert("App created successfully!")
    }, 1500)
  }

  return (
    <DashboardLayout role="developer" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Create New App</h1>
          <p className="text-muted-foreground">Create a new application to integrate with the platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>App Details</CardTitle>
            <CardDescription>Enter the details for your new application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Input
                id="appName"
                placeholder="My Awesome App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="A brief description of your app"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateApp} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create App"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

