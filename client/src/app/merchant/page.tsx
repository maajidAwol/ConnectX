"use client"

import React from "react"
import Link from "next/link"
import { ArrowUpRight, Clock, DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/protected-route"
import { useEffect } from "react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import useMerchantDashboardStore from "@/store/useMerchantDashboardStore"

export default function MerchantPage() {
  const { 
    overview,
    recentActivities,
    recentOrders,
    topProducts,
    isLoading,
    error,
    fetchOverview,
    fetchRecentActivities,
    fetchRecentOrders,
    fetchTopProducts
  } = useMerchantDashboardStore()

  useEffect(() => {
    fetchOverview()
    fetchRecentActivities()
    fetchRecentOrders()
    fetchTopProducts()
  }, [fetchOverview, fetchRecentActivities, fetchRecentOrders, fetchTopProducts])

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
              {isLoading.overview ? (
                <Skeleton className="h-8 w-[120px]" />
              ) : error.overview ? (
                <div className="text-red-500 text-sm">{error.overview}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{Number(overview?.total_revenue).toLocaleString()} ETB</div>
                    {/* <div className="flex items-center pt-1">
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">+12.5%</span>
                      <span className="text-xs text-muted-foreground ml-1">from last month</span>
                    </div> */}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading.overview ? (
                <Skeleton className="h-8 w-[120px]" />
              ) : error.overview ? (
                <div className="text-red-500 text-sm">{error.overview}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">+{overview?.total_orders}</div>
                  {/* <div className="flex items-center pt-1">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+8.2%</span>
                    <span className="text-xs text-muted-foreground ml-1">from last month</span>
                  </div> */}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading.overview ? (
                <Skeleton className="h-8 w-[120px]" />
              ) : error.overview ? (
                <div className="text-red-500 text-sm">{error.overview}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{overview?.total_products}</div>
                    {/* <div className="flex items-center pt-1">
                      <span className="text-xs text-muted-foreground">12 added this month</span>
                    </div> */}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading.overview ? (
                <Skeleton className="h-8 w-[120px]" />
              ) : error.overview ? (
                <div className="text-red-500 text-sm">{error.overview}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{overview?.total_customers}</div>
                  {/* <div className="flex items-center pt-1">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+5.1%</span>
                    <span className="text-xs text-muted-foreground ml-1">from last month</span>
                  </div> */}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 min-h-48">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading.orders ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[40px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error.orders ? (
                <div className="text-center py-4 text-red-500">{error.orders}</div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent orders found</p>
                      <p className="text-sm text-muted-foreground mt-1">New orders will appear here</p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">{order.order_number}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>{order.customer_name}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{order.status}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(order.created_at), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">${parseFloat(order.total_amount).toLocaleString()}</span>
                          <Link href={`/merchant/orders/${order.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                            View
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Direct Sales</span>
                    <span className="font-medium">${Number(overview?.total_revenue || 0) * 0.65}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-full w-[65%] rounded-full bg-blue-500"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Marketplace</span>
                    <span className="font-medium">${Number(overview?.total_revenue || 0) * 0.35}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-full w-[35%] rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Affiliate</span>
                    <span className="font-medium">${Number(overview?.total_revenue || 0) * 0.25}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-full w-[25%] rounded-full bg-yellow-500"></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Revenue</span>
                    <span className="font-bold">${Number(overview?.total_revenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>By sales volume</CardDescription>
              </div>
              <Link href="/merchant/products" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading.products ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  ))}
                </div>
              ) : error.products ? (
                <div className="text-center py-4 text-red-500">{error.products}</div>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.total_sales} units</p>
                      </div>
                      <span className="text-sm font-medium">${parseFloat(product.total_revenue).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest store events</CardDescription>
              </div>
              {/* <Link href="/merchant/orders" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link> */}
            </CardHeader>
            <CardContent>
              {isLoading.activities ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error.activities ? (
                <div className="text-center py-4 text-red-500">{error.activities}</div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
