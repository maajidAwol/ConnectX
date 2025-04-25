"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  ArrowUp,
  Calendar,
  Download,
  LineChart,
  PieChart,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react"
import { salesData, products } from "@/lib/data"

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("30d")

  // Calculate total sales and revenue
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0)
  const totalRevenue = products.reduce((sum, product) => {
    const revenue = Number.parseFloat(product.revenue.replace("$", "").replace(",", ""))
    return sum + revenue
  }, 0)

  // Calculate average order value
  const averageOrderValue = totalRevenue / totalSales

  // Calculate month-over-month growth (simulated)
  const salesGrowth = 12.5
  const revenueGrowth = 15.2
  const customerGrowth = 8.7

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your e-commerce performance and insights</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center rounded-md border bg-background p-1 text-sm">
            <button
              className={`px-3 py-1 rounded-sm ${
                dateRange === "7d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setDateRange("7d")}
            >
              7D
            </button>
            <button
              className={`px-3 py-1 rounded-sm ${
                dateRange === "30d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setDateRange("30d")}
            >
              30D
            </button>
            <button
              className={`px-3 py-1 rounded-sm ${
                dateRange === "90d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setDateRange("90d")}
            >
              90D
            </button>
            <button
              className={`px-3 py-1 rounded-sm ${
                dateRange === "1y" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setDateRange("1y")}
            >
              1Y
            </button>
          </div>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Custom Range</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center pt-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>+{revenueGrowth}%</span>
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <div className="flex items-center pt-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>+{salesGrowth}%</span>
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <div className="flex items-center pt-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>+2.4%</span>
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+124</div>
            <div className="flex items-center pt-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>+{customerGrowth}%</span>
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs. last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="channels">Channel Insights</TabsTrigger>
          <TabsTrigger value="customers">Customer Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Revenue breakdown for the past{" "}
                  {dateRange === "7d"
                    ? "7 days"
                    : dateRange === "30d"
                      ? "30 days"
                      : dateRange === "90d"
                        ? "90 days"
                        : "year"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border p-4">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center">
                      <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Revenue Chart</p>
                      <p className="text-xs text-muted-foreground">
                        Showing data for{" "}
                        {dateRange === "7d"
                          ? "last 7 days"
                          : dateRange === "30d"
                            ? "last 30 days"
                            : dateRange === "90d"
                              ? "last 90 days"
                              : "last year"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Sales Channels</CardTitle>
                <CardDescription>Revenue by sales channel</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border p-4">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Direct Sales</span>
                          <span className="font-medium">${salesData.direct.toLocaleString()}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-full w-[65%] rounded-full bg-blue-500"></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Marketplace</span>
                          <span className="font-medium">${salesData.marketplace.toLocaleString()}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-full w-[35%] rounded-full bg-green-500"></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Affiliate</span>
                          <span className="font-medium">${salesData.affiliate.toLocaleString()}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-full w-[25%] rounded-full bg-yellow-500"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <PieChart className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Sales and revenue by product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Units Sold</div>
                  <div className="col-span-2 text-center">Revenue</div>
                  <div className="col-span-2 text-center">Growth</div>
                  <div className="col-span-1 text-right">Trend</div>
                </div>
                <div className="divide-y">
                  {products
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 5)
                    .map((product, index) => {
                      // Generate random growth percentage for demo
                      const growth = Math.floor(Math.random() * 30) - 5
                      const isPositive = growth > 0

                      return (
                        <div key={product.id} className="grid grid-cols-12 items-center p-3">
                          <div className="col-span-5">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.sku}</div>
                          </div>
                          <div className="col-span-2 text-center">{product.sales}</div>
                          <div className="col-span-2 text-center">{product.revenue}</div>
                          <div className="col-span-2 text-center">
                            <span
                              className={isPositive ? "text-green-600" : "text-red-600"}
                            >{`${isPositive ? "+" : ""}${growth}%`}</span>
                          </div>
                          <div className="col-span-1 flex justify-end">
                            {isPositive ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>View All Products</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>Sales and conversion by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-4">Channel</div>
                    <div className="col-span-2 text-center">Traffic</div>
                    <div className="col-span-2 text-center">Orders</div>
                    <div className="col-span-2 text-center">Revenue</div>
                    <div className="col-span-2 text-center">Conversion</div>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        name: "Direct",
                        traffic: "12,450",
                        orders: "542",
                        revenue: "$24,331",
                        conversion: "4.35%",
                      },
                      {
                        name: "Organic Search",
                        traffic: "8,294",
                        orders: "312",
                        revenue: "$15,762",
                        conversion: "3.76%",
                      },
                      {
                        name: "Social Media",
                        traffic: "6,352",
                        orders: "195",
                        revenue: "$9,842",
                        conversion: "3.07%",
                      },
                      {
                        name: "Email",
                        traffic: "4,129",
                        orders: "247",
                        revenue: "$12,458",
                        conversion: "5.98%",
                      },
                      {
                        name: "Referral",
                        traffic: "2,845",
                        orders: "132",
                        revenue: "$8,442",
                        conversion: "4.64%",
                      },
                    ].map((channel, index) => (
                      <div key={index} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-4 font-medium">{channel.name}</div>
                        <div className="col-span-2 text-center">{channel.traffic}</div>
                        <div className="col-span-2 text-center">{channel.orders}</div>
                        <div className="col-span-2 text-center">{channel.revenue}</div>
                        <div className="col-span-2 text-center">{channel.conversion}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <div className="h-full w-full rounded-md border p-4">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-4">
                      {[
                        { name: "Direct", percentage: 36, color: "bg-blue-500" },
                        { name: "Organic Search", percentage: 24, color: "bg-green-500" },
                        { name: "Social Media", percentage: 18, color: "bg-yellow-500" },
                        { name: "Email", percentage: 12, color: "bg-purple-500" },
                        { name: "Referral", percentage: 8, color: "bg-red-500" },
                        { name: "Other", percentage: 2, color: "bg-gray-500" },
                      ].map((source, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{source.name}</span>
                            <span className="font-medium">{source.percentage}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full ${source.color}`}
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center">
                      <PieChart className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Age and gender distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border p-4">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center">
                      <PieChart className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Demographics Chart</p>
                      <p className="text-xs text-muted-foreground">Age and gender distribution</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>New vs returning customers</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border p-4">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>New Customers</span>
                          <span className="font-medium">42%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-full w-[42%] rounded-full bg-blue-500"></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Returning Customers</span>
                          <span className="font-medium">58%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-full w-[58%] rounded-full bg-green-500"></div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">Customer Lifetime Value</div>
                            <div className="text-2xl font-bold">$245.81</div>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <ArrowUp className="mr-1 h-3 w-3" />
                            <span>+12.3%</span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Ratings and reviews</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border p-4">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">4.8/5</div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <ArrowUp className="mr-1 h-3 w-3" />
                          <span>+0.2</span>
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {[
                          { stars: 5, percentage: 85 },
                          { stars: 4, percentage: 10 },
                          { stars: 3, percentage: 3 },
                          { stars: 2, percentage: 1 },
                          { stars: 1, percentage: 1 },
                        ].map((rating) => (
                          <div key={rating.stars} className="flex items-center gap-2">
                            <div className="text-sm font-medium w-3">{rating.stars}</div>
                            <div className="h-2 flex-1 rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-yellow-400"
                                style={{ width: `${rating.percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground w-8">{rating.percentage}%</div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <div className="text-sm font-medium">Total Reviews</div>
                        <div className="text-2xl font-bold">1,248</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <Button variant="outline" className="gap-2">
                        <ArrowRight className="h-4 w-4" />
                        <span>View All Reviews</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
