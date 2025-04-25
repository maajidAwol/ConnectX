import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Filter, Search, Settings } from "lucide-react"

export default function ApiRateLimits() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API Rate Limits</h2>
        <p className="text-muted-foreground">Configure and monitor API rate limits and usage</p>
      </div>

      <Tabs defaultValue="limits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="limits">Rate Limit Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Usage Monitoring</TabsTrigger>
          <TabsTrigger value="violations">Limit Violations</TabsTrigger>
        </TabsList>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Rate Limits</CardTitle>
              <CardDescription>Configure platform-wide API rate limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enable-rate-limits" className="flex flex-col space-y-1">
                    <span>Enable Rate Limiting</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Apply rate limits to all API endpoints
                    </span>
                  </Label>
                  <Switch id="enable-rate-limits" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="adaptive-limits" className="flex flex-col space-y-1">
                    <span>Adaptive Rate Limiting</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically adjust limits based on system load
                    </span>
                  </Label>
                  <Switch id="adaptive-limits" />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="graduated-penalties" className="flex flex-col space-y-1">
                    <span>Graduated Penalties</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Increase penalty severity for repeated violations
                    </span>
                  </Label>
                  <Switch id="graduated-penalties" defaultChecked />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="default-rate">Default Rate Limit (requests per minute)</Label>
                  <Input id="default-rate" type="number" defaultValue={60} />
                  <p className="text-sm text-muted-foreground">Default limit applied to all API consumers</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="burst-rate">Burst Rate Limit (requests per second)</Label>
                  <Input id="burst-rate" type="number" defaultValue={10} />
                  <p className="text-sm text-muted-foreground">Maximum requests allowed in a single second</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="daily-limit">Daily Request Limit</Label>
                  <Input id="daily-limit" type="number" defaultValue={10000} />
                  <p className="text-sm text-muted-foreground">Maximum requests allowed per day per consumer</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="violation-threshold">Violation Threshold</Label>
                  <Input id="violation-threshold" type="number" defaultValue={5} />
                  <p className="text-sm text-muted-foreground">Number of violations before automatic suspension</p>
                </div>
              </div>

              <Button>Save Global Rate Limits</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endpoint-Specific Rate Limits</CardTitle>
              <CardDescription>Configure rate limits for specific API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    endpoint: "/api/v2/products",
                    methods: ["GET", "POST", "PUT", "DELETE"],
                    defaultLimit: 100,
                    burstLimit: 15,
                    sensitive: false,
                  },
                  {
                    endpoint: "/api/v2/orders",
                    methods: ["GET", "POST", "PUT"],
                    defaultLimit: 80,
                    burstLimit: 10,
                    sensitive: false,
                  },
                  {
                    endpoint: "/api/v2/customers",
                    methods: ["GET", "POST", "PUT"],
                    defaultLimit: 60,
                    burstLimit: 8,
                    sensitive: true,
                  },
                  {
                    endpoint: "/api/v2/payments",
                    methods: ["GET", "POST"],
                    defaultLimit: 40,
                    burstLimit: 5,
                    sensitive: true,
                  },
                  {
                    endpoint: "/api/v2/analytics",
                    methods: ["GET"],
                    defaultLimit: 30,
                    burstLimit: 5,
                    sensitive: false,
                  },
                ].map((endpoint, index) => (
                  <div key={index} className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{endpoint.endpoint}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {endpoint.methods.map((method) => (
                            <Badge
                              key={method}
                              variant="outline"
                              className={
                                method === "GET"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : method === "POST"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : method === "PUT"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {method}
                            </Badge>
                          ))}
                          {endpoint.sensitive && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              Sensitive
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`rate-${index}`}>Rate Limit (requests per minute)</Label>
                        <Input id={`rate-${index}`} type="number" defaultValue={endpoint.defaultLimit} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`burst-${index}`}>Burst Limit (requests per second)</Label>
                        <Input id={`burst-${index}`} type="number" defaultValue={endpoint.burstLimit} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button>Save Endpoint Limits</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Monitoring</CardTitle>
              <CardDescription>Monitor real-time API usage and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search by developer or endpoint..." className="pl-8 w-full" />
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                  <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="all">All Endpoints</option>
                    <option value="products">Products</option>
                    <option value="orders">Orders</option>
                    <option value="customers">Customers</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Developer/Application</div>
                  <div className="col-span-3">Endpoint</div>
                  <div className="col-span-2">Requests (24h)</div>
                  <div className="col-span-2">Avg. Response Time</div>
                  <div className="col-span-2">Limit Usage</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      developer: "TechSolutions Inc.",
                      application: "ShopSync",
                      endpoint: "/api/v2/products",
                      method: "GET",
                      requests: "124,567",
                      responseTime: "45ms",
                      limitUsage: 62,
                    },
                    {
                      developer: "TechSolutions Inc.",
                      application: "ShopSync",
                      endpoint: "/api/v2/orders",
                      method: "GET",
                      requests: "98,321",
                      responseTime: "78ms",
                      limitUsage: 85,
                    },
                    {
                      developer: "DataSync Solutions",
                      application: "DataHarvester",
                      endpoint: "/api/v2/analytics",
                      method: "GET",
                      requests: "56,789",
                      responseTime: "120ms",
                      limitUsage: 95,
                    },
                    {
                      developer: "Sarah Williams",
                      application: "OrderBot",
                      endpoint: "/api/v2/orders",
                      method: "POST",
                      requests: "34,567",
                      responseTime: "65ms",
                      limitUsage: 43,
                    },
                    {
                      developer: "Alex Johnson",
                      application: "MobileShop",
                      endpoint: "/api/v2/customers",
                      method: "GET",
                      requests: "23,456",
                      responseTime: "55ms",
                      limitUsage: 39,
                    },
                  ].map((usage, index) => (
                    <div key={index} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3">
                        <div className="font-medium">{usage.developer}</div>
                        <div className="text-sm text-muted-foreground">{usage.application}</div>
                      </div>
                      <div className="col-span-3">
                        <div className="font-medium">
                          <Badge
                            variant="outline"
                            className={
                              usage.method === "GET"
                                ? "bg-green-50 text-green-700 border-green-200 mr-2"
                                : usage.method === "POST"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 mr-2"
                                  : usage.method === "PUT"
                                    ? "bg-amber-50 text-amber-700 border-amber-200 mr-2"
                                    : "bg-red-50 text-red-700 border-red-200 mr-2"
                            }
                          >
                            {usage.method}
                          </Badge>
                          {usage.endpoint}
                        </div>
                      </div>
                      <div className="col-span-2">{usage.requests}</div>
                      <div className="col-span-2">{usage.responseTime}</div>
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className={`h-2.5 rounded-full ${
                                usage.limitUsage < 60
                                  ? "bg-green-500"
                                  : usage.limitUsage < 85
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${usage.limitUsage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{usage.limitUsage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Performance Metrics</CardTitle>
              <CardDescription>Monitor API performance and response times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Average Response Time</h3>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">68ms</div>
                      <p className="text-sm text-green-600">-5ms from yesterday</p>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Total Requests (24h)</h3>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">1.2M</div>
                      <p className="text-sm text-green-600">+8% from yesterday</p>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Error Rate</h3>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">0.8%</div>
                      <p className="text-sm text-green-600">-0.2% from yesterday</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-4">Endpoint Performance</h3>
                  <div className="space-y-4">
                    {[
                      {
                        endpoint: "/api/v2/products",
                        responseTime: "45ms",
                        errorRate: "0.5%",
                        trend: "stable",
                      },
                      {
                        endpoint: "/api/v2/orders",
                        responseTime: "78ms",
                        errorRate: "0.7%",
                        trend: "improving",
                      },
                      {
                        endpoint: "/api/v2/customers",
                        responseTime: "55ms",
                        errorRate: "0.6%",
                        trend: "stable",
                      },
                      {
                        endpoint: "/api/v2/analytics",
                        responseTime: "120ms",
                        errorRate: "1.2%",
                        trend: "degrading",
                      },
                      {
                        endpoint: "/api/v2/payments",
                        responseTime: "95ms",
                        errorRate: "0.9%",
                        trend: "stable",
                      },
                    ].map((endpoint, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div className="font-medium">{endpoint.endpoint}</div>
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-sm font-medium">{endpoint.responseTime}</div>
                            <div className="text-xs text-muted-foreground">Avg. Response</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{endpoint.errorRate}</div>
                            <div className="text-xs text-muted-foreground">Error Rate</div>
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={
                                endpoint.trend === "improving"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : endpoint.trend === "stable"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {endpoint.trend}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limit Violations</CardTitle>
              <CardDescription>Monitor and manage API rate limit violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search violations..." className="pl-8 w-full" />
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                  <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="all">All Violations</option>
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Developer/Application</div>
                  <div className="col-span-2">Violation Type</div>
                  <div className="col-span-2">Endpoint</div>
                  <div className="col-span-2">Timestamp</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      developer: "DataSync Solutions",
                      application: "DataHarvester",
                      type: "Burst Limit",
                      severity: "Critical",
                      endpoint: "/api/v2/analytics",
                      timestamp: "Today, 10:23 AM",
                      status: "Suspended",
                    },
                    {
                      developer: "TechSolutions Inc.",
                      application: "ShopSync",
                      type: "Rate Limit",
                      severity: "Major",
                      endpoint: "/api/v2/products",
                      timestamp: "Today, 09:15 AM",
                      status: "Warning Issued",
                    },
                    {
                      developer: "Sarah Williams",
                      application: "OrderBot",
                      type: "Daily Limit",
                      severity: "Minor",
                      endpoint: "/api/v2/orders",
                      timestamp: "Yesterday, 11:42 PM",
                      status: "Resolved",
                    },
                    {
                      developer: "Alex Johnson",
                      application: "MobileShop",
                      type: "Rate Limit",
                      severity: "Minor",
                      endpoint: "/api/v2/customers",
                      timestamp: "Yesterday, 03:18 PM",
                      status: "Resolved",
                    },
                    {
                      developer: "DataSync Solutions",
                      application: "DataHarvester",
                      type: "Burst Limit",
                      severity: "Major",
                      endpoint: "/api/v2/products",
                      timestamp: "2 days ago, 08:55 AM",
                      status: "Warning Issued",
                    },
                  ].map((violation, index) => (
                    <div key={index} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3">
                        <div className="font-medium">{violation.developer}</div>
                        <div className="text-sm text-muted-foreground">{violation.application}</div>
                      </div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            violation.severity === "Critical"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : violation.severity === "Major"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {violation.type}
                        </Badge>
                      </div>
                      <div className="col-span-2">{violation.endpoint}</div>
                      <div className="col-span-2">
                        <div className="text-sm">{violation.timestamp}</div>
                      </div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            violation.status === "Suspended"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : violation.status === "Warning Issued"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {violation.status}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
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
              <CardTitle>Violation Response Policy</CardTitle>
              <CardDescription>Configure automated responses to rate limit violations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="auto-response" className="flex flex-col space-y-1">
                    <span>Automated Responses</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically respond to rate limit violations
                    </span>
                  </Label>
                  <Switch id="auto-response" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="auto-suspend" className="flex flex-col space-y-1">
                    <span>Automatic Suspension</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically suspend accounts after repeated violations
                    </span>
                  </Label>
                  <Switch id="auto-suspend" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="notify-admin" className="flex flex-col space-y-1">
                    <span>Admin Notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Notify administrators of critical violations
                    </span>
                  </Label>
                  <Switch id="notify-admin" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Violation Response Levels</h3>
                <div className="space-y-4">
                  {[
                    {
                      level: "Minor Violation",
                      description: "Single instance of exceeding rate limit",
                      action: "Automated warning email",
                      cooldown: "None",
                    },
                    {
                      level: "Major Violation",
                      description: "Multiple instances within 24 hours",
                      action: "Temporary rate limit reduction (50%)",
                      cooldown: "24 hours",
                    },
                    {
                      level: "Critical Violation",
                      description: "Persistent abuse or extreme overuse",
                      action: "Account suspension",
                      cooldown: "Manual review required",
                    },
                  ].map((level, index) => (
                    <div key={index} className="rounded-md border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{level.level}</h4>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                      <div className="grid gap-2 md:grid-cols-3">
                        <div>
                          <div className="text-sm font-medium">Description</div>
                          <div className="text-sm text-muted-foreground">{level.description}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Action</div>
                          <div className="text-sm text-muted-foreground">{level.action}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Cooldown Period</div>
                          <div className="text-sm text-muted-foreground">{level.cooldown}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button>Save Violation Policies</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
