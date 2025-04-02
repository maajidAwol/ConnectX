"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
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
  TrendingUp,
  BarChart,
  PieChart,
  LineChart,
  AlertCircle,
} from "lucide-react"

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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedChannel, setSelectedChannel] = useState("all")

  // Mock data - replace with real data from API
  const salesData = {
    totalRevenue: 125000,
    growth: 12.5,
    averageOrderValue: 85.50,
    totalOrders: 1462,
    topProducts: [
      { name: "Premium Wireless Headphones", revenue: 25000, units: 250 },
      { name: "Smart Fitness Watch", revenue: 18000, units: 180 },
      { name: "Classic Denim Jacket", revenue: 15000, units: 150 },
    ],
    salesByChannel: [
      { channel: "Website", revenue: 75000, percentage: 60 },
      { channel: "Mobile App", revenue: 37500, percentage: 30 },
      { channel: "Marketplace", revenue: 12500, percentage: 10 },
    ],
  }

  const customerData = {
    totalCustomers: 2500,
    newCustomers: 150,
    retentionRate: 85,
    customerSegments: [
      { segment: "High Value", count: 500, revenue: 75000 },
      { segment: "Medium Value", count: 1500, revenue: 40000 },
      { segment: "Low Value", count: 500, revenue: 10000 },
    ],
    demographics: [
      { category: "Age 18-24", percentage: 25 },
      { category: "Age 25-34", percentage: 35 },
      { category: "Age 35-44", percentage: 20 },
      { category: "Age 45+", percentage: 20 },
    ],
  }

  const stockData = {
    totalProducts: 150,
    lowStock: 12,
    outOfStock: 3,
    stockValue: 75000,
    turnoverRate: 4.2,
    reorderRecommendations: [
      { product: "Premium Wireless Headphones", currentStock: 15, reorderPoint: 20 },
      { product: "Smart Fitness Watch", currentStock: 8, reorderPoint: 25 },
      { product: "Classic Denim Jacket", currentStock: 5, reorderPoint: 15 },
    ],
  }

  return (
    <DashboardLayout navigation={navigation} role="merchant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
            <p className="text-muted-foreground">Track your business performance and make data-driven decisions</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales Performance</TabsTrigger>
            <TabsTrigger value="channels">Channel Analytics</TabsTrigger>
            <TabsTrigger value="customers">Customer Insights</TabsTrigger>
            <TabsTrigger value="stock">Stock Reports</TabsTrigger>
          </TabsList>

          {/* Sales Performance Tab */}
          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${salesData.totalRevenue.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-green-500">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    {salesData.growth}% from last period
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${salesData.averageOrderValue}</div>
                  <p className="text-xs text-muted-foreground">Per order</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesData.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Orders this period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Product</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${salesData.topProducts[0].revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{salesData.topProducts[0].name}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Units Sold</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.topProducts.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.revenue.toLocaleString()}</TableCell>
                        <TableCell>{product.units}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-green-500">
                            <TrendingUp className="mr-1 h-4 w-4" />
                            <span>+8.2%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channel Analytics Tab */}
          <TabsContent value="channels" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {salesData.salesByChannel.map((channel) => (
                <Card key={channel.channel}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">{channel.channel}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${channel.revenue.toLocaleString()}</div>
                    <div className="mt-2">
                      <Progress value={channel.percentage} className="h-2" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {channel.percentage}% of total revenue
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>Revenue breakdown by sales channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Chart visualization would go here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Insights Tab */}
          <TabsContent value="customers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerData.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">Active customers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerData.newCustomers}</div>
                  <p className="text-xs text-muted-foreground">This period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerData.retentionRate}%</div>
                  <p className="text-xs text-muted-foreground">Customer retention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Segments</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerData.customerSegments.length}</div>
                  <p className="text-xs text-muted-foreground">Active segments</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Segment</TableHead>
                        <TableHead>Customers</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerData.customerSegments.map((segment) => (
                        <TableRow key={segment.segment}>
                          <TableCell className="font-medium">{segment.segment}</TableCell>
                          <TableCell>{segment.count}</TableCell>
                          <TableCell>${segment.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerData.demographics.map((demo) => (
                      <div key={demo.category}>
                        <div className="flex items-center justify-between text-sm">
                          <span>{demo.category}</span>
                          <span>{demo.percentage}%</span>
                        </div>
                        <Progress value={demo.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stock Reports Tab */}
          <TabsContent value="stock" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockData.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Active products</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockData.lowStock}</div>
                  <p className="text-xs text-muted-foreground">Items below threshold</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockData.outOfStock}</div>
                  <p className="text-xs text-muted-foreground">Items to restock</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stockData.stockValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total inventory value</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Reorder Recommendations</CardTitle>
                <CardDescription>Products that need to be reordered soon</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockData.reorderRecommendations.map((product) => (
                      <TableRow key={product.product}>
                        <TableCell className="font-medium">{product.product}</TableCell>
                        <TableCell>{product.currentStock}</TableCell>
                        <TableCell>{product.reorderPoint}</TableCell>
                        <TableCell>
                          <Badge variant={product.currentStock <= product.reorderPoint ? "destructive" : "warning"}>
                            {product.currentStock <= product.reorderPoint ? "Critical" : "Low"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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

