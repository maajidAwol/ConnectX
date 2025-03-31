"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  BarChart3,
  Code2,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Building2,
  Users,
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

export default function AdminAnalyticsPage() {
  const [search, setSearch] = useState("")

  return (
    <DashboardLayout role="admin" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Platform analytics and reporting</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Analytics</CardTitle>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search metrics..."
                className="w-full rounded-md border bg-background pl-8 md:w-64 lg:w-80"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <p>Analytics data would appear here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

