import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Box, Check, Filter, Link, Package, Search, Settings } from "lucide-react"

export default function ProductLinkage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Product Linkage</h2>
        <p className="text-muted-foreground">Manage developer product integrations and linkages</p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integration Directory</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace Management</TabsTrigger>
          <TabsTrigger value="approvals">Integration Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search integrations..." className="pl-8 w-full" />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="all">All Categories</option>
                <option value="inventory">Inventory</option>
                <option value="shipping">Shipping</option>
                <option value="marketing">Marketing</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Developer Integrations</CardTitle>
              <CardDescription>Manage third-party integrations and connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Integration</div>
                  <div className="col-span-2">Developer</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Connected Merchants</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      id: 1,
                      name: "ShopSync",
                      description: "Inventory management integration",
                      developer: "TechSolutions Inc.",
                      category: "Inventory",
                      merchants: 1245,
                      status: "Active",
                    },
                    {
                      id: 2,
                      name: "OrderBot",
                      description: "Order automation system",
                      developer: "Sarah Williams",
                      category: "Orders",
                      merchants: 876,
                      status: "Active",
                    },
                    {
                      id: 3,
                      name: "ShipEasy",
                      description: "Shipping label generator",
                      developer: "Logistics Pro",
                      category: "Shipping",
                      merchants: 1532,
                      status: "Active",
                    },
                    {
                      id: 4,
                      name: "MarketBoost",
                      description: "Marketing automation platform",
                      developer: "Growth Hackers",
                      category: "Marketing",
                      merchants: 654,
                      status: "Active",
                    },
                    {
                      id: 5,
                      name: "DataInsight",
                      description: "Advanced analytics dashboard",
                      developer: "DataSync Solutions",
                      category: "Analytics",
                      merchants: 321,
                      status: "Suspended",
                    },
                  ].map((integration) => (
                    <div key={integration.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-sm text-muted-foreground">{integration.description}</div>
                        </div>
                      </div>
                      <div className="col-span-2">{integration.developer}</div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {integration.category}
                        </Badge>
                      </div>
                      <div className="col-span-2">{integration.merchants.toLocaleString()}</div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            integration.status === "Active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/developers/products/${integration.id}`}>
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Settings</span>
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
              <CardTitle>Integration Categories</CardTitle>
              <CardDescription>Manage integration categories and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Inventory Management",
                    description: "Integrations that manage product inventory",
                    permissions: ["Read Products", "Update Inventory", "Read Orders"],
                    dataAccess: "Medium",
                  },
                  {
                    name: "Order Processing",
                    description: "Integrations that process and fulfill orders",
                    permissions: ["Read Orders", "Update Orders", "Read Customers (Limited)"],
                    dataAccess: "Medium",
                  },
                  {
                    name: "Shipping & Fulfillment",
                    description: "Integrations for shipping and order fulfillment",
                    permissions: ["Read Orders", "Update Shipping", "Create Labels"],
                    dataAccess: "Medium",
                  },
                  {
                    name: "Marketing & Promotions",
                    description: "Integrations for marketing and promotional activities",
                    permissions: ["Read Products", "Read Customers", "Create Discounts"],
                    dataAccess: "High",
                  },
                  {
                    name: "Analytics & Reporting",
                    description: "Integrations for data analysis and reporting",
                    permissions: ["Read Products", "Read Orders", "Read Analytics"],
                    dataAccess: "High",
                  },
                  {
                    name: "Payment Processing",
                    description: "Integrations for payment processing",
                    permissions: ["Read Orders", "Process Payments", "Issue Refunds"],
                    dataAccess: "Critical",
                  },
                ].map((category, index) => (
                  <div key={index} className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          category.dataAccess === "Low"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : category.dataAccess === "Medium"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {category.dataAccess} Data Access
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Required Permissions:</div>
                      <div className="flex flex-wrap gap-2">
                        {category.permissions.map((permission, i) => (
                          <Badge key={i} variant="outline">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Management</CardTitle>
              <CardDescription>Manage the integration marketplace for merchants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enable-marketplace" className="flex flex-col space-y-1">
                    <span>Enable Marketplace</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Allow merchants to discover and install integrations
                    </span>
                  </Label>
                  <Switch id="enable-marketplace" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="auto-approve" className="flex flex-col space-y-1">
                    <span>Auto-Approve Trusted Developers</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically approve marketplace listings from trusted developers
                    </span>
                  </Label>
                  <Switch id="auto-approve" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="featured-rotation" className="flex flex-col space-y-1">
                    <span>Featured Integration Rotation</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically rotate featured integrations weekly
                    </span>
                  </Label>
                  <Switch id="featured-rotation" />
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-4">Featured Integrations</h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: "ShopSync",
                        developer: "TechSolutions Inc.",
                        category: "Inventory",
                        featured: true,
                      },
                      {
                        name: "ShipEasy",
                        developer: "Logistics Pro",
                        category: "Shipping",
                        featured: true,
                      },
                      {
                        name: "MarketBoost",
                        developer: "Growth Hackers",
                        category: "Marketing",
                        featured: true,
                      },
                    ].map((integration, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package className="h-4 w-4 text-blue-700" />
                          </div>
                          <div>
                            <div className="font-medium">{integration.name}</div>
                            <div className="text-sm text-muted-foreground">{integration.developer}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {integration.category}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-4">Marketplace Categories</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { name: "Inventory Management", count: 24, enabled: true },
                      { name: "Order Processing", count: 18, enabled: true },
                      { name: "Shipping & Fulfillment", count: 15, enabled: true },
                      { name: "Marketing & Promotions", count: 22, enabled: true },
                      { name: "Analytics & Reporting", count: 17, enabled: true },
                      { name: "Payment Processing", count: 12, enabled: true },
                      { name: "Customer Support", count: 9, enabled: true },
                      { name: "Product Management", count: 14, enabled: true },
                    ].map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">{category.count} integrations</div>
                        </div>
                        <Switch checked={category.enabled} />
                      </div>
                    ))}
                  </div>
                </div>

                <Button>Save Marketplace Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Approval Queue</CardTitle>
              <CardDescription>Review and approve new integration submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Integration</div>
                  <div className="col-span-2">Developer</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      id: 1,
                      name: "EcomTools",
                      description: "E-commerce toolkit",
                      developer: "Michael Chen",
                      category: "Multiple",
                      submitted: "Today",
                      status: "Pending Review",
                    },
                    {
                      id: 2,
                      name: "InventoryPro",
                      description: "Advanced inventory management",
                      developer: "Inventory Solutions Ltd.",
                      category: "Inventory",
                      submitted: "Yesterday",
                      status: "In Review",
                    },
                    {
                      id: 3,
                      name: "CustomerInsight",
                      description: "Customer analytics platform",
                      developer: "DataSync Solutions",
                      category: "Analytics",
                      submitted: "3 days ago",
                      status: "Additional Info Requested",
                    },
                    {
                      id: 4,
                      name: "ShippingMaster",
                      description: "Global shipping solution",
                      developer: "Global Logistics Inc.",
                      category: "Shipping",
                      submitted: "5 days ago",
                      status: "Security Review",
                    },
                  ].map((integration) => (
                    <div key={integration.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Box className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-sm text-muted-foreground">{integration.description}</div>
                        </div>
                      </div>
                      <div className="col-span-2">{integration.developer}</div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {integration.category}
                        </Badge>
                      </div>
                      <div className="col-span-2">{integration.submitted}</div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            integration.status === "Pending Review"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : integration.status === "In Review"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : integration.status === "Security Review"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="outline" size="sm">
                          Review
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
              <CardTitle>Integration Review Process</CardTitle>
              <CardDescription>Configure the integration review and approval process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="security-scan" className="flex flex-col space-y-1">
                    <span>Automated Security Scan</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Run automated security scans on all integration submissions
                    </span>
                  </Label>
                  <Switch id="security-scan" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="code-review" className="flex flex-col space-y-1">
                    <span>Manual Code Review</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Require manual code review for all integrations
                    </span>
                  </Label>
                  <Switch id="code-review" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="data-access-review" className="flex flex-col space-y-1">
                    <span>Data Access Review</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Review all data access permissions requested by integrations
                    </span>
                  </Label>
                  <Switch id="data-access-review" defaultChecked />
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-4">Review Checklist</h3>
                <div className="space-y-2">
                  {[
                    "Verify developer identity and credentials",
                    "Review integration functionality and purpose",
                    "Validate requested API permissions",
                    "Check for security vulnerabilities",
                    "Verify privacy policy and terms of service",
                    "Test integration functionality",
                    "Review user experience and interface",
                    "Verify compliance with platform guidelines",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="mt-0.5">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-sm">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-period">Maximum Review Period (Days)</Label>
                <Input id="review-period" type="number" defaultValue={5} className="w-20" />
                <p className="text-sm text-muted-foreground">Maximum time to complete the review process</p>
              </div>

              <Button>Save Review Process Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
