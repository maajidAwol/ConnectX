import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Download, Filter, Search, Settings, Shield, User } from "lucide-react"

export default function MerchantAccountManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Merchant Account Management</h2>
        <p className="text-muted-foreground">Manage merchant accounts, permissions, and settings</p>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Account Settings</TabsTrigger>
          <TabsTrigger value="permissions">Permission Templates</TabsTrigger>
          <TabsTrigger value="tiers">Account Tiers</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search accounts..." className="pl-8 w-full" />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="all">All Accounts</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deactivated">Deactivated</option>
              </select>
              <Button variant="outline" size="sm" className="ml-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Merchant Accounts</CardTitle>
              <CardDescription>Manage merchant account settings and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Merchant</div>
                  <div className="col-span-2">Account Type</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">2FA</div>
                  <div className="col-span-2">Last Activity</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      id: 1,
                      name: "TechGadgets Store",
                      email: "admin@techgadgets.com",
                      type: "Business",
                      status: "Active",
                      twoFactor: true,
                      lastActivity: "2 hours ago",
                    },
                    {
                      id: 2,
                      name: "Fashion Forward",
                      email: "support@fashionforward.com",
                      type: "Enterprise",
                      status: "Active",
                      twoFactor: true,
                      lastActivity: "1 day ago",
                    },
                    {
                      id: 3,
                      name: "Organic Foods Co.",
                      email: "hello@organicfoods.com",
                      type: "Business",
                      status: "Suspended",
                      twoFactor: false,
                      lastActivity: "5 days ago",
                    },
                    {
                      id: 4,
                      name: "Digital Downloads",
                      email: "info@digitaldownloads.com",
                      type: "Individual",
                      status: "Active",
                      twoFactor: false,
                      lastActivity: "Just now",
                    },
                    {
                      id: 5,
                      name: "Handmade Crafts",
                      email: "crafts@handmade.com",
                      type: "Business",
                      status: "Deactivated",
                      twoFactor: false,
                      lastActivity: "30 days ago",
                    },
                  ].map((account) => (
                    <div key={account.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-muted-foreground">{account.email}</div>
                        </div>
                      </div>
                      <div className="col-span-2">{account.type}</div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            account.status === "Active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : account.status === "Suspended"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {account.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        {account.twoFactor ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-2">{account.lastActivity}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                          <span className="sr-only">Settings</span>
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
              <CardTitle>Account Security Settings</CardTitle>
              <CardDescription>Configure global security settings for merchant accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="require-2fa" className="flex flex-col space-y-1">
                    <span>Require Two-Factor Authentication</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Require all merchants to enable 2FA for their accounts
                    </span>
                  </Label>
                  <Switch id="require-2fa" />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="password-expiry" className="flex flex-col space-y-1">
                    <span>Password Expiration</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Force password reset every 90 days
                    </span>
                  </Label>
                  <Switch id="password-expiry" />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="session-timeout" className="flex flex-col space-y-1">
                    <span>Session Timeout</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically log out inactive users after 30 minutes
                    </span>
                  </Label>
                  <Switch id="session-timeout" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-attempts">Maximum Login Attempts</Label>
                <Input id="login-attempts" type="number" defaultValue={5} className="w-20" />
                <p className="text-sm text-muted-foreground">Number of failed login attempts before account lockout</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lockout-duration">Account Lockout Duration (Minutes)</Label>
                <Input id="lockout-duration" type="number" defaultValue={30} className="w-20" />
                <p className="text-sm text-muted-foreground">
                  Duration of account lockout after exceeding maximum login attempts
                </p>
              </div>

              <Button>Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Templates</CardTitle>
              <CardDescription>Configure permission templates for different merchant roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    id: "admin",
                    title: "Administrator",
                    description: "Full access to all merchant features",
                    isDefault: false,
                  },
                  {
                    id: "manager",
                    title: "Store Manager",
                    description: "Can manage products, orders, and customers",
                    isDefault: true,
                  },
                  {
                    id: "support",
                    title: "Customer Support",
                    description: "Can view orders and manage customer inquiries",
                    isDefault: false,
                  },
                  {
                    id: "inventory",
                    title: "Inventory Manager",
                    description: "Can manage products and inventory only",
                    isDefault: false,
                  },
                  {
                    id: "finance",
                    title: "Finance Manager",
                    description: "Can access financial reports and transactions",
                    isDefault: false,
                  },
                ].map((template) => (
                  <div
                    key={template.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">{template.title}</h3>
                        {template.isDefault && (
                          <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Shield className="mr-2 h-4 w-4" />
                        Edit Permissions
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Set as Default
                      </Button>
                    </div>
                  </div>
                ))}
                <Button>
                  <Shield className="mr-2 h-4 w-4" />
                  Create New Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permission Categories</CardTitle>
              <CardDescription>Configure available permission categories for merchant accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "products",
                    title: "Products & Inventory",
                    permissions: [
                      "View Products",
                      "Create Products",
                      "Edit Products",
                      "Delete Products",
                      "Manage Inventory",
                    ],
                  },
                  {
                    id: "orders",
                    title: "Orders & Fulfillment",
                    permissions: ["View Orders", "Process Orders", "Cancel Orders", "Issue Refunds", "Manage Shipping"],
                  },
                  {
                    id: "customers",
                    title: "Customers & Support",
                    permissions: [
                      "View Customers",
                      "Edit Customer Data",
                      "Manage Support Tickets",
                      "Send Communications",
                    ],
                  },
                  {
                    id: "analytics",
                    title: "Analytics & Reporting",
                    permissions: ["View Reports", "Export Data", "Access Financial Data", "View Customer Insights"],
                  },
                  {
                    id: "settings",
                    title: "Store Settings",
                    permissions: ["Edit Store Profile", "Manage Payment Methods", "Configure Taxes", "Manage Users"],
                  },
                ].map((category) => (
                  <div key={category.id} className="rounded-md border p-4">
                    <h3 className="font-medium mb-2">{category.title}</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {category.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox id={`${category.id}-${index}`} defaultChecked />
                          <Label htmlFor={`${category.id}-${index}`} className="text-sm">
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button>Save Permission Categories</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Tiers</CardTitle>
              <CardDescription>Configure merchant account tiers and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    id: "free",
                    title: "Free",
                    description: "Basic features for small merchants",
                    limits: {
                      products: 50,
                      storage: "500 MB",
                      support: "Email Only",
                      fee: "3.5% + $0.30",
                    },
                  },
                  {
                    id: "business",
                    title: "Business",
                    description: "Advanced features for growing businesses",
                    limits: {
                      products: 500,
                      storage: "5 GB",
                      support: "Priority Email",
                      fee: "2.9% + $0.30",
                    },
                  },
                  {
                    id: "enterprise",
                    title: "Enterprise",
                    description: "Complete solution for large merchants",
                    limits: {
                      products: "Unlimited",
                      storage: "50 GB",
                      support: "24/7 Phone & Email",
                      fee: "2.5% + $0.30",
                    },
                  },
                  {
                    id: "custom",
                    title: "Custom",
                    description: "Tailored solutions for unique business needs",
                    limits: {
                      products: "Unlimited",
                      storage: "Custom",
                      support: "Dedicated Account Manager",
                      fee: "Custom Pricing",
                    },
                  },
                ].map((tier) => (
                  <div key={tier.id} className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg">{tier.title}</h3>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Tier
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Products</span>
                        <span className="text-sm font-medium">{tier.limits.products}</span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Storage</span>
                        <span className="text-sm font-medium">{tier.limits.storage}</span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Support</span>
                        <span className="text-sm font-medium">{tier.limits.support}</span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Transaction Fee</span>
                        <span className="text-sm font-medium">{tier.limits.fee}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button>Create New Tier</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tier Upgrade Rules</CardTitle>
              <CardDescription>Configure rules for automatic tier recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-threshold">Business Tier Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="business-threshold" type="number" defaultValue={5000} className="w-32" />
                    <span className="text-sm text-muted-foreground">USD monthly revenue</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommend Business tier when monthly revenue exceeds this amount
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-threshold">Enterprise Tier Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="enterprise-threshold" type="number" defaultValue={25000} className="w-32" />
                    <span className="text-sm text-muted-foreground">USD monthly revenue</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommend Enterprise tier when monthly revenue exceeds this amount
                  </p>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="auto-notify" className="flex flex-col space-y-1">
                    <span>Automatic Upgrade Notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically notify merchants when they qualify for a tier upgrade
                    </span>
                  </Label>
                  <Switch id="auto-notify" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="grace-period" className="flex flex-col space-y-1">
                    <span>Tier Downgrade Grace Period</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Allow 30 days before downgrading merchants who no longer meet tier requirements
                    </span>
                  </Label>
                  <Switch id="grace-period" defaultChecked />
                </div>

                <Button>Save Tier Rules</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
