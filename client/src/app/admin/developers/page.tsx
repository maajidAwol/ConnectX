import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  ArrowUpRight,
  Code,
  Download,
  ExternalLink,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
} from "lucide-react"

export default function DeveloperDirectory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Developer Directory</h2>
        <p className="text-muted-foreground">Manage developer accounts and API access</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search developers..." className="pl-8 w-full" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="all">All Developers</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="new">New</option>
          </select>
          <Button variant="outline" size="sm" className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="developers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="developers">Developer Accounts</TabsTrigger>
          <TabsTrigger value="applications">API Applications</TabsTrigger>
          <TabsTrigger value="activity">API Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="developers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Developer Accounts</CardTitle>
              <CardDescription>Manage developer accounts and access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Developer</div>
                  <div className="col-span-2">Account Type</div>
                  <div className="col-span-2">API Usage</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Last Activity</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      id: 1,
                      name: "Alex Johnson",
                      email: "alex@devteam.com",
                      type: "Individual",
                      apiUsage: "12,450 calls/day",
                      status: "Active",
                      lastActivity: "2 hours ago",
                    },
                    {
                      id: 2,
                      name: "TechSolutions Inc.",
                      email: "api@techsolutions.com",
                      type: "Organization",
                      apiUsage: "156,230 calls/day",
                      status: "Active",
                      lastActivity: "5 minutes ago",
                    },
                    {
                      id: 3,
                      name: "Sarah Williams",
                      email: "sarah@integrations.io",
                      type: "Individual",
                      apiUsage: "5,120 calls/day",
                      status: "Active",
                      lastActivity: "1 day ago",
                    },
                    {
                      id: 4,
                      name: "DataSync Solutions",
                      email: "dev@datasync.co",
                      type: "Organization",
                      apiUsage: "78,900 calls/day",
                      status: "Suspended",
                      lastActivity: "5 days ago",
                    },
                    {
                      id: 5,
                      name: "Michael Chen",
                      email: "michael@appdev.com",
                      type: "Individual",
                      apiUsage: "0 calls/day",
                      status: "New",
                      lastActivity: "Just registered",
                    },
                  ].map((developer) => (
                    <div key={developer.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                          <Code className="h-4 w-4 text-purple-700" />
                        </div>
                        <div>
                          <div className="font-medium">{developer.name}</div>
                          <div className="text-sm text-muted-foreground">{developer.email}</div>
                        </div>
                      </div>
                      <div className="col-span-2">{developer.type}</div>
                      <div className="col-span-2">{developer.apiUsage}</div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            developer.status === "Active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : developer.status === "Suspended"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {developer.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">{developer.lastActivity}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/developers/${developer.id}`}>
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Developer Verification Status</CardTitle>
              <CardDescription>Developers requiring verification or review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    name: "Michael Chen",
                    email: "michael@appdev.com",
                    status: "Pending Verification",
                    date: "Today",
                    issue: null,
                  },
                  {
                    id: 2,
                    name: "EcomTools Ltd.",
                    email: "developers@ecomtools.net",
                    status: "Document Review",
                    date: "Yesterday",
                    issue: null,
                  },
                  {
                    id: 3,
                    name: "DataSync Solutions",
                    email: "dev@datasync.co",
                    status: "Suspended",
                    date: "5 days ago",
                    issue: "Rate limit violations",
                  },
                ].map((developer) => (
                  <div
                    key={developer.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                        <Code className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <div className="font-medium">{developer.name}</div>
                        <div className="text-sm text-muted-foreground">{developer.email}</div>
                        <div className="flex items-center mt-1">
                          <Badge
                            variant="outline"
                            className={
                              developer.status === "Suspended"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }
                          >
                            {developer.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">{developer.date}</span>
                          {developer.issue && (
                            <div className="flex items-center ml-2 text-xs text-red-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {developer.issue}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                      {developer.status === "Suspended" && (
                        <Button variant="outline" size="sm">
                          Reinstate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Applications</CardTitle>
              <CardDescription>Manage registered API applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Application</div>
                  <div className="col-span-2">Developer</div>
                  <div className="col-span-2">API Version</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      id: 1,
                      name: "ShopSync",
                      description: "Inventory management integration",
                      developer: "TechSolutions Inc.",
                      apiVersion: "v2",
                      status: "Approved",
                      created: "Jan 15, 2023",
                    },
                    {
                      id: 2,
                      name: "OrderBot",
                      description: "Order automation system",
                      developer: "Sarah Williams",
                      apiVersion: "v2",
                      status: "Approved",
                      created: "Mar 22, 2023",
                    },
                    {
                      id: 3,
                      name: "DataHarvester",
                      description: "Analytics and reporting tool",
                      developer: "DataSync Solutions",
                      apiVersion: "v1",
                      status: "Suspended",
                      created: "Apr 10, 2023",
                    },
                    {
                      id: 4,
                      name: "MobileShop",
                      description: "Mobile shopping application",
                      developer: "Alex Johnson",
                      apiVersion: "v2",
                      status: "Approved",
                      created: "May 5, 2023",
                    },
                    {
                      id: 5,
                      name: "EcomTools",
                      description: "E-commerce toolkit",
                      developer: "Michael Chen",
                      apiVersion: "v2",
                      status: "Pending Review",
                      created: "Today",
                    },
                  ].map((app) => (
                    <div key={app.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-muted-foreground">{app.description}</div>
                        </div>
                      </div>
                      <div className="col-span-2">{app.developer}</div>
                      <div className="col-span-2">{app.apiVersion}</div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            app.status === "Approved"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : app.status === "Suspended"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">{app.created}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Activity Overview</CardTitle>
              <CardDescription>Recent API activity and usage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Top API Consumers</h3>
                  <div className="space-y-4">
                    {[
                      {
                        developer: "TechSolutions Inc.",
                        application: "ShopSync",
                        calls: "156,230",
                        change: "+12%",
                      },
                      {
                        developer: "DataSync Solutions",
                        application: "DataHarvester",
                        calls: "78,900",
                        change: "-5%",
                      },
                      {
                        developer: "Alex Johnson",
                        application: "MobileShop",
                        calls: "12,450",
                        change: "+8%",
                      },
                      {
                        developer: "Sarah Williams",
                        application: "OrderBot",
                        calls: "5,120",
                        change: "+3%",
                      },
                    ].map((consumer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium">{consumer.developer}</div>
                          <div className="text-sm text-muted-foreground">{consumer.application}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{consumer.calls} calls/day</div>
                          <div
                            className={
                              consumer.change.startsWith("+") ? "text-sm text-green-600" : "text-sm text-red-600"
                            }
                          >
                            {consumer.change} from last week
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Most Used Endpoints</h3>
                  <div className="space-y-4">
                    {[
                      {
                        endpoint: "/api/v2/products",
                        method: "GET",
                        calls: "245,678",
                        change: "+15%",
                      },
                      {
                        endpoint: "/api/v2/orders",
                        method: "GET",
                        calls: "198,321",
                        change: "+10%",
                      },
                      {
                        endpoint: "/api/v2/customers",
                        method: "GET",
                        calls: "156,432",
                        change: "+8%",
                      },
                      {
                        endpoint: "/api/v2/products",
                        method: "POST",
                        calls: "87,654",
                        change: "+5%",
                      },
                      {
                        endpoint: "/api/v2/orders",
                        method: "POST",
                        calls: "76,543",
                        change: "+7%",
                      },
                    ].map((endpoint, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium">
                            <span
                              className={
                                endpoint.method === "GET"
                                  ? "text-green-600"
                                  : endpoint.method === "POST"
                                    ? "text-blue-600"
                                    : endpoint.method === "PUT"
                                      ? "text-amber-600"
                                      : "text-red-600"
                              }
                            >
                              {endpoint.method}
                            </span>{" "}
                            {endpoint.endpoint}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{endpoint.calls} calls/day</div>
                          <div className="text-sm text-green-600">{endpoint.change} from last week</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href="/admin/developers/api-limits">
                      View Detailed Analytics
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
