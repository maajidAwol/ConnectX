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
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
  return (
    <DashboardLayout
      title="Marketplace"
      description="Loading integrations..."
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
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-24" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>API Usage</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

