"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Code2,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Building2,
  Users,
  BarChart3,
  Activity,
  ShieldAlert,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

const navigation = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Merchants",
    href: "/admin/merchants",
    icon: Building2,
    badge: 3,
  },
  {
    title: "Developers",
    href: "/admin/developers",
    icon: Code2,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "System Health",
    href: "/admin/system-health",
    icon: Activity,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: ShieldAlert,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/admin/help",
    icon: HelpCircle,
  },
]

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("ConnectX")
  const [supportEmail, setSupportEmail] = useState("support@connectx.com")

  const handleSaveSettings = () => {
    alert("Settings saved!")
  }

  return (
    <DashboardLayout role="admin" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure platform settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Configure general platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                placeholder="ConnectX"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                placeholder="support@connectx.com"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

