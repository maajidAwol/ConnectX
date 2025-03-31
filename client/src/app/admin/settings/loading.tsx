import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"
import {
  LayoutDashboard,
  Building2,
  Code2,
  Users,
  BarChart3,
  Activity,
  ShieldAlert,
  Settings,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Loading() {
  return (
    <DashboardLayout
      title="Settings"
      description="Loading settings..."
      role="admin"
      navigation={[
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
      ]}
    >
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Configure general platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

