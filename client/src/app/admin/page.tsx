"use client"

import Link from "next/link"
import { ArrowUpRight, BarChart3, CheckCircle, Clock, DollarSign, Users, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { adminMetrics, systemMetrics, topMerchants, apiUsage, adminActivity } from "@/lib/data"
import ProtectedRoute from "@/components/protected-route"
import usePendingVerificationsStore from "@/store/usePendingVerificationsStore"
import useAdminAnalyticsStore from "@/store/useAdminAnalyticsStore"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

export default function AdminPage() {
  const { pendingVerifications, isLoading: isVerificationsLoading, error, fetchPendingVerifications } = usePendingVerificationsStore()
  const { 
    overview,
    recentActivities, 
    topTenants, 
    apiUsage: apiUsageData,
    isLoading: { 
      overview: isOverviewLoading,
      activities: isActivitiesLoading, 
      tenants: isTenantsLoading, 
      api: isApiLoading 
    },
    error: { 
      overview: overviewError,
      activities: activitiesError, 
      tenants: tenantsError, 
      api: apiError 
    },
    fetchOverview,
    fetchRecentActivities,
    fetchTopTenants,
    fetchApiUsage
  } = useAdminAnalyticsStore()

  useEffect(() => {
    fetchPendingVerifications()
    fetchOverview()
    fetchRecentActivities()
    fetchTopTenants()
    fetchApiUsage()
  }, [fetchPendingVerifications, fetchOverview, fetchRecentActivities, fetchTopTenants, fetchApiUsage])

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">System overview, health, performance, and metrics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isOverviewLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ) : overviewError ? (
                <div className="text-red-500">{overviewError}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{overview?.total_merchants.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Active merchants on platform</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isOverviewLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ) : overviewError ? (
                <div className="text-red-500">{overviewError}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{Number(overview?.total_revenue).toLocaleString()} ETB</div>
                  <p className="text-xs text-muted-foreground">Total platform revenue</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isOverviewLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ) : overviewError ? (
                <div className="text-red-500">{overviewError}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{overview?.total_orders.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total orders processed</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {isOverviewLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ) : overviewError ? (
                <div className="text-red-500">{overviewError}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{overview?.active_tenants.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Currently active tenants</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Merchant Approval Queue</CardTitle>
              <CardDescription>Merchants awaiting verification and approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isVerificationsLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                      <Skeleton className="h-8 w-[80px]" />
                    </div>
                  ))
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  pendingVerifications.map((merchant) => (
                    <div key={merchant.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium">{merchant.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>
                            Submitted {new Date(merchant.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/admin/merchants/${merchant.id}`} 
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </div>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isActivitiesLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))
                ) : activitiesError ? (
                  <div className="text-red-500">{activitiesError}</div>
                ) : (
                  recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        {activity.user ? (
                          <Image
                            src={activity.user.avatar_url || "/placeholder.svg"}
                            alt={activity.user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Top Merchants</CardTitle>
                <CardDescription>By transaction volume</CardDescription>
              </div>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isTenantsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  ))
                ) : tenantsError ? (
                  <div className="text-red-500">{tenantsError}</div>
                ) : (
                  topTenants.map((tenant, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{tenant.tenant_name}</p>
                        <p className="text-sm text-muted-foreground">{tenant.total_orders} orders</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {Number(tenant.total_revenue).toLocaleString()} ETB
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Top endpoints by request volume</CardDescription>
              </div>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isApiLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  ))
                ) : apiError ? (
                  <div className="text-red-500">{apiError}</div>
                ) : (
                  apiUsageData.map((api, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{api.endpoint}</p>
                        <p className="text-sm text-muted-foreground">{api.total_calls} requests</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {api.success_rate.toFixed(1)}% success
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
