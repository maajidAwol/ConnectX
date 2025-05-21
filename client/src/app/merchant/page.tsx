"use client"

import Link from "next/link"
import { ArrowUpRight, Clock, DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { products, orders, salesData, merchantActivity } from "@/lib/data"
import ProtectedRoute from "@/components/protected-route"

export default function MerchantPage() {
  // In a real application, this data would be fetched from an API
  // For example:
  // const { data: salesData, isLoading } = useSWR('/api/sales', fetcher)

  return (
    <ProtectedRoute requiredRoles={["owner", "member"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Merchant Dashboard</h2>
          <p className="text-muted-foreground">Business metrics, quick stats, and insights</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${salesData.total.toLocaleString()}</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+12.5%</span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+8.2%</span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="flex items-center pt-1">
                <span className="text-xs text-muted-foreground">12 added this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,845</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+5.1%</span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{order.id}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{order.customer}</span>
                        <span className="mx-2">•</span>
                        <span>{order.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{order.amount}</span>
                      <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
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

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Revenue</span>
                    <span className="font-bold">${salesData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Products with low stock</CardDescription>
              </div>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products
                  .filter((p) => p.stock <= 8)
                  .map((product, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                      <span className={`text-sm font-medium ${product.stock <= 5 ? "text-red-600" : "text-yellow-600"}`}>
                        {product.stock} in stock
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>By sales volume</CardDescription>
              </div>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products
                  .sort((a, b) => b.sales - a.sales)
                  .slice(0, 4)
                  .map((product, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units</p>
                      </div>
                      <span className="text-sm font-medium">{product.revenue}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest store events</CardDescription>
              </div>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {merchantActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
