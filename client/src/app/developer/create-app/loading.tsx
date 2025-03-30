import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"
import {
  LayoutDashboard,
  Compass,
  Code,
  Terminal,
  FileCode,
  Book,
  ShieldCheck,
  Settings,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Loading() {
  return (
    <DashboardLayout
      title="Create New App"
      description="Loading create app form..."
      role="developer"
      navigation={[
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
      ]}
    >
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>App Details</CardTitle>
            <CardDescription>Enter the details for your new application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

