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
      title="API Explorer"
      description="Loading API Explorer..."
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
            <CardTitle>API Request</CardTitle>
            <CardDescription>Enter the endpoint, method, and request body to test the API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestBody">Request Body</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API Response</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

