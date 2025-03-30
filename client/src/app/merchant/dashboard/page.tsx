"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Box,
  DollarSign,
  Download,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  {
    title: "Dashboard",
    href: "/merchant/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/merchant/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/merchant/orders",
    icon: ShoppingCart,
    badge: 8,
  },
  {
    title: "Customers",
    href: "/merchant/customers",
    icon: Users,
  },
  {
    title: "Stock",
    href: "/merchant/stock",
    icon: Box,
  },
  {
    title: "Analytics",
    href: "/merchant/analytics",
    icon: BarChart3,
  },
  {
    title: "Marketing",
    href: "/merchant/marketing",
    icon: Tag,
  },
  {
    title: "Settings",
    href: "/merchant/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/merchant/help",
    icon: HelpCircle,
  },
]

export default function MerchantDashboard() {
  return (
    <DashboardLayout role="merchant" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Global Gadgets. Here&apos;s an overview of your store.</p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">256</div>
                  <p className="text-xs text-muted-foreground">+8 new this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,834</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Your sales performance over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[240px] flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Sales chart visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Your best-selling products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Wireless Earbuds Pro</span>
                        <span className="text-sm text-muted-foreground">$129.99</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-muted-foreground">142 units sold</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Smart Watch X2</span>
                        <span className="text-sm text-muted-foreground">$249.99</span>
                      </div>
                      <Progress value={72} className="h-2" />
                      <p className="text-xs text-muted-foreground">98 units sold</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Portable Charger 20000mAh</span>
                        <span className="text-sm text-muted-foreground">$49.99</span>
                      </div>
                      <Progress value={64} className="h-2" />
                      <p className="text-xs text-muted-foreground">87 units sold</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bluetooth Speaker Mini</span>
                        <span className="text-sm text-muted-foreground">$79.99</span>
                      </div>
                      <Progress value={53} className="h-2" />
                      <p className="text-xs text-muted-foreground">76 units sold</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your most recent customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-7245</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <span>John Doe</span>
                        </div>
                      </TableCell>
                      <TableCell>3 items</TableCell>
                      <TableCell>$329.97</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                        >
                          Processing
                        </Badge>
                      </TableCell>
                      <TableCell>2 hours ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-7244</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>AS</AvatarFallback>
                          </Avatar>
                          <span>Alice Smith</span>
                        </div>
                      </TableCell>
                      <TableCell>1 item</TableCell>
                      <TableCell>$249.99</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Shipped
                        </Badge>
                      </TableCell>
                      <TableCell>Yesterday</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-7243</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>RJ</AvatarFallback>
                          </Avatar>
                          <span>Robert Johnson</span>
                        </div>
                      </TableCell>
                      <TableCell>2 items</TableCell>
                      <TableCell>$179.98</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Delivered
                        </Badge>
                      </TableCell>
                      <TableCell>2 days ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-7242</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>EW</AvatarFallback>
                          </Avatar>
                          <span>Emily Wilson</span>
                        </div>
                      </TableCell>
                      <TableCell>4 items</TableCell>
                      <TableCell>$459.96</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Delivered
                        </Badge>
                      </TableCell>
                      <TableCell>3 days ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-7241</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>MB</AvatarFallback>
                          </Avatar>
                          <span>Michael Brown</span>
                        </div>
                      </TableCell>
                      <TableCell>1 item</TableCell>
                      <TableCell>$79.99</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                        >
                          Returned
                        </Badge>
                      </TableCell>
                      <TableCell>4 days ago</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Orders
                </Button>
                <Button>View All Orders</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage all your customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-7245</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>3 items</TableCell>
                      <TableCell>$329.97</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                        >
                          Processing
                        </Badge>
                      </TableCell>
                      <TableCell>2 hours ago</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Ship
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-7244</TableCell>
                      <TableCell>Alice Smith</TableCell>
                      <TableCell>1 item</TableCell>
                      <TableCell>$249.99</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Shipped
                        </Badge>
                      </TableCell>
                      <TableCell>Yesterday</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#ORD-7243</TableCell>
                      <TableCell>Robert Johnson</TableCell>
                      <TableCell>2 items</TableCell>
                      <TableCell>$179.98</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Delivered
                        </Badge>
                      </TableCell>
                      <TableCell>2 days ago</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>View and manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted"></div>
                          <span className="font-medium">Wireless Earbuds Pro</span>
                        </div>
                      </TableCell>
                      <TableCell>Audio</TableCell>
                      <TableCell>$129.99</TableCell>
                      <TableCell>142</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Public
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted"></div>
                          <span className="font-medium">Smart Watch X2</span>
                        </div>
                      </TableCell>
                      <TableCell>Wearables</TableCell>
                      <TableCell>$249.99</TableCell>
                      <TableCell>98</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Public
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted"></div>
                          <span className="font-medium">Portable Charger 20000mAh</span>
                        </div>
                      </TableCell>
                      <TableCell>Accessories</TableCell>
                      <TableCell>$49.99</TableCell>
                      <TableCell>87</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Public
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted"></div>
                          <span className="font-medium">Bluetooth Speaker Mini</span>
                        </div>
                      </TableCell>
                      <TableCell>Audio</TableCell>
                      <TableCell>$79.99</TableCell>
                      <TableCell>76</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-800 dark:bg-slate-800/20 dark:text-slate-400"
                        >
                          Private
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted"></div>
                          <span className="font-medium">Ultra HD Camera</span>
                        </div>
                      </TableCell>
                      <TableCell>Photography</TableCell>
                      <TableCell>$399.99</TableCell>
                      <TableCell>32</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Public
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Import Products</Button>
                <Button>Add New Product</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage your customer database</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <span>John Doe</span>
                        </div>
                      </TableCell>
                      <TableCell>john.doe@example.com</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>$1,245.89</TableCell>
                      <TableCell>2 hours ago</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>AS</AvatarFallback>
                          </Avatar>
                          <span>Alice Smith</span>
                        </div>
                      </TableCell>
                      <TableCell>alice.smith@example.com</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>$879.45</TableCell>
                      <TableCell>Yesterday</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>RJ</AvatarFallback>
                          </Avatar>
                          <span>Robert Johnson</span>
                        </div>
                      </TableCell>
                      <TableCell>robert.johnson@example.com</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>$542.20</TableCell>
                      <TableCell>2 days ago</TableCell>
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
                <Button variant="outline">Export Customers</Button>
                <Button>View All Customers</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

