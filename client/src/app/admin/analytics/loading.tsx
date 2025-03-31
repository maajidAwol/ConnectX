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
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <DashboardLayout
      title="Analytics"
      description="Loading analytics..."
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

