"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Book,
  Code,
  Code2,
  Compass,
  FileCode,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

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

export default function DeveloperDashboard() {
  return (
    <DashboardLayout role="developer" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, DevTech Solutions. Here&apos;s an overview of your integrations.
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="api-usage">API Usage</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
                  <Code2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+3 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2M</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Health</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.9%</div>
                  <p className="text-xs text-muted-foreground">+0.1% from last week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>API Usage</CardTitle>
                  <CardDescription>Your API request volume over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[240px] flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">API usage chart visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Popular Integrations</CardTitle>
                  <CardDescription>Your most used merchant product integrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Global Gadgets - Product API</span>
                        <span className="text-sm text-muted-foreground">450K requests</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Fashion Forward - Catalog API</span>
                        <span className="text-sm text-muted-foreground">320K requests</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Acme Corp - Order API</span>
                        <span className="text-sm text-muted-foreground">280K requests</span>
                      </div>
                      <Progress value={64} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tech Innovations - Stock API</span>
                        <span className="text-sm text-muted-foreground">150K requests</span>
                      </div>
                      <Progress value={53} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent API Activity</CardTitle>
                <CardDescription>Your recent API requests and responses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">/api/products</TableCell>
                      <TableCell>GET</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          200 OK
                        </Badge>
                      </TableCell>
                      <TableCell>124ms</TableCell>
                      <TableCell>2 minutes ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">/api/orders/7245</TableCell>
                      <TableCell>GET</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          200 OK
                        </Badge>
                      </TableCell>
                      <TableCell>98ms</TableCell>
                      <TableCell>15 minutes ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">/api/customers</TableCell>
                      <TableCell>POST</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          201 Created
                        </Badge>
                      </TableCell>
                      <TableCell>156ms</TableCell>
                      <TableCell>42 minutes ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">/api/products/invalid</TableCell>
                      <TableCell>GET</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                        >
                          404 Not Found
                        </Badge>
                      </TableCell>
                      <TableCell>45ms</TableCell>
                      <TableCell>1 hour ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">/api/stock/update</TableCell>
                      <TableCell>PUT</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          200 OK
                        </Badge>
                      </TableCell>
                      <TableCell>134ms</TableCell>
                      <TableCell>3 hours ago</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View API Logs</Button>
                <Button>API Documentation</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Integrations</CardTitle>
                <CardDescription>Manage your merchant product integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input placeholder="Search integrations..." />
                </div>
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
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">Global Gadgets</span>
                        </div>
                      </TableCell>
                      <TableCell>Product API</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>450K requests/month</TableCell>
                      <TableCell>2 minutes ago</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">Fashion Forward</span>
                        </div>
                      </TableCell>
                      <TableCell>Catalog API</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>320K requests/month</TableCell>
                      <TableCell>15 minutes ago</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">Acme Corp</span>
                        </div>
                      </TableCell>
                      <TableCell>Order API</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>280K requests/month</TableCell>
                      <TableCell>42 minutes ago</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">Tech Innovations</span>
                        </div>
                      </TableCell>
                      <TableCell>Stock API</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>150K requests/month</TableCell>
                      <TableCell>1 hour ago</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View All Integrations</Button>
                <Button>Add New Integration</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="api-usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Usage Analytics</CardTitle>
                <CardDescription>Monitor your API consumption and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md mb-6">
                  <p className="text-muted-foreground">API usage analytics chart would appear here</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1.2M</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Average Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">124ms</div>
                      <p className="text-xs text-muted-foreground">-12ms from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Error Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0.3%</div>
                      <p className="text-xs text-muted-foreground">-0.1% from last month</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>Manage your frontend implementation projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Integrations</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Team Members</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">E-commerce Mobile App</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>2 hours ago</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Retail Dashboard</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                        >
                          In Development
                        </Badge>
                      </TableCell>
                      <TableCell>Yesterday</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Stock Management System</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>3 days ago</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View All Projects</Button>
                <Button>Create New Project</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

