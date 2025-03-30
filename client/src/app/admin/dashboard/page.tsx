"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle,
  Code2,
  DollarSign,
  HelpCircle,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Administrator. Here&apos;s an overview of the platform.</p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="merchants">Merchants</TabsTrigger>
            <TabsTrigger value="developers">Developers</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Developers</CardTitle>
                  <Code2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,427</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$48,294</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.7%</div>
                  <p className="text-xs text-muted-foreground">+0.2% from last week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Platform performance and health metrics</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">API Services</span>
                        </div>
                        <span className="text-sm text-muted-foreground">99.9% Uptime</span>
                      </div>
                      <Progress value={99.9} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Database Cluster</span>
                        </div>
                        <span className="text-sm text-muted-foreground">100% Uptime</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">Authentication Services</span>
                        </div>
                        <span className="text-sm text-muted-foreground">97.2% Uptime</span>
                      </div>
                      <Progress value={97.2} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Storage Services</span>
                        </div>
                        <span className="text-sm text-muted-foreground">99.8% Uptime</span>
                      </div>
                      <Progress value={99.8} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>Merchant and developer accounts awaiting approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">New Merchants</span>
                        <Badge>12</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">New Developers</span>
                        <Badge>8</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">API Access Requests</span>
                        <Badge>23</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Support Tickets</span>
                        <Badge>17</Badge>
                      </div>
                    </div>
                    <Button className="w-full">View All Pending Items</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and events across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">New merchant registration</TableCell>
                      <TableCell>Acme Corp</TableCell>
                      <TableCell>Merchant</TableCell>
                      <TableCell>2 minutes ago</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                        >
                          Pending
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">API access request</TableCell>
                      <TableCell>DevTech Solutions</TableCell>
                      <TableCell>Developer</TableCell>
                      <TableCell>15 minutes ago</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                        >
                          Pending
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Product catalog update</TableCell>
                      <TableCell>Global Gadgets</TableCell>
                      <TableCell>Merchant</TableCell>
                      <TableCell>42 minutes ago</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">System maintenance</TableCell>
                      <TableCell>System</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell>1 hour ago</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Security alert</TableCell>
                      <TableCell>System</TableCell>
                      <TableCell>Security</TableCell>
                      <TableCell>3 hours ago</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                        >
                          Alert
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

