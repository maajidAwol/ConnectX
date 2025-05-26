"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { useTheme } from "next-themes"
import { useAnalyticsStore } from "@/store/analyticsStore"

// Skeleton components for different chart types
function ChartSkeleton({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className={`${height} w-full`}>
      <div className="flex items-end justify-between h-full space-x-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2 flex-1">
            <Skeleton className="w-full bg-muted/50" style={{ height: `${Math.random() * 60 + 20}%` }} />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

function PieChartSkeleton({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className={`${height} w-full flex items-center justify-center`}>
      <div className="relative">
        <Skeleton className="w-40 h-40 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-16 h-16 rounded-full bg-background" />
        </div>
      </div>
    </div>
  )
}

function LineChartSkeleton({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className={`${height} w-full p-4`}>
      <div className="h-full relative">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-0">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border-r border-b border-muted/20 last:border-r-0" />
          ))}
        </div>

        {/* Line path skeleton */}
        <div className="absolute inset-4">
          <svg className="w-full h-full">
            <path
              d="M 0 80 Q 50 60 100 70 T 200 50 T 300 60 T 400 40"
              stroke="hsl(var(--muted))"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-20" />
        </div>

        {/* Overview Tab Content Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Revenue Chart Card */}
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pl-2">
              <LineChartSkeleton />
            </CardContent>
          </Card>

          {/* Pie Chart Card */}
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="pl-2">
              <PieChartSkeleton />
            </CardContent>
          </Card>
        </div>

        {/* Additional Cards Skeleton */}
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <ChartSkeleton height="h-[350px]" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <LineChartSkeleton height="h-[350px]" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-52" />
            </CardHeader>
            <CardContent>
              <ChartSkeleton height="h-[350px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const {
    apiEndpoints,
    monthlyRevenue,
    newMerchants,
    weekdayTransactions,
    isLoading,
    error,
    fetchApiEndpoints,
    fetchMonthlyRevenue,
    fetchNewMerchants,
    fetchWeekdayTransactions,
  } = useAnalyticsStore()

  useEffect(() => {
    fetchApiEndpoints()
    fetchMonthlyRevenue()
    fetchNewMerchants()
    fetchWeekdayTransactions()
  }, [fetchApiEndpoints, fetchMonthlyRevenue, fetchNewMerchants, fetchWeekdayTransactions])

  const chartColors = {
    primary: isDark ? "hsl(var(--primary))" : "hsl(var(--primary))",
    secondary: isDark ? "hsl(var(--secondary))" : "hsl(var(--secondary))",
    accent: isDark ? "hsl(var(--accent))" : "hsl(var(--accent))",
    muted: isDark ? "hsl(var(--muted))" : "hsl(var(--muted))",
    grid: isDark ? "hsl(var(--border))" : "hsl(var(--border))",
    text: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
  }

  // Transform data for charts with null checks
  const revenueData =
    monthlyRevenue?.labels?.map((label, index) => ({
      month: label,
      revenue: monthlyRevenue.values[index],
    })) || []

  const merchantDistributionData =
    apiEndpoints?.labels?.map((label, index) => ({
      name: label,
      value: apiEndpoints.values[index],
      color:
        index === 0
          ? chartColors.primary
          : index === 1
            ? chartColors.secondary
            : index === 2
              ? chartColors.accent
              : chartColors.muted,
    })) || []

  const merchantGrowthData =
    newMerchants?.labels?.map((label, index) => ({
      month: label,
      new: newMerchants.values[index],
    })) || []

  const transactionData =
    weekdayTransactions?.labels?.map((label, index) => ({
      day: label,
      volume: weekdayTransactions.counts[index],
      value: weekdayTransactions.revenue[index],
    })) || []

  if (isLoading) {
    return <AnalyticsLoadingSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="text-lg text-destructive">Error loading analytics data</div>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Analytics</h2>
        <p className="text-muted-foreground">View and analyze platform performance metrics</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: chartColors.primary,
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                      <XAxis dataKey="month" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                      <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: isDark ? "hsl(var(--background))" : "white",
                          border: `1px solid ${chartColors.grid}`,
                          borderRadius: "6px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={chartColors.primary}
                        strokeWidth={2}
                        dot={{ fill: chartColors.primary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>API Endpoint Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: isDark ? "hsl(var(--background))" : "white",
                          border: `1px solid ${chartColors.grid}`,
                          borderRadius: "6px",
                        }}
                      />
                      <Pie
                        data={merchantDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {merchantDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="merchants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Merchants</CardTitle>
              <CardDescription>Monthly merchant acquisition</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  new: {
                    label: "New Merchants",
                    color: chartColors.primary,
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={merchantGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="month" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                    <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: isDark ? "hsl(var(--background))" : "white",
                        border: `1px solid ${chartColors.grid}`,
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="new" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>Daily transaction volume and value</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  volume: {
                    label: "Volume",
                    color: chartColors.primary,
                  },
                  value: {
                    label: "Value ($)",
                    color: chartColors.secondary,
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="day" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                    <YAxis yAxisId="left" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: isDark ? "hsl(var(--background))" : "white",
                        border: `1px solid ${chartColors.grid}`,
                        borderRadius: "6px",
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="volume"
                      stroke={chartColors.primary}
                      strokeWidth={2}
                      dot={{ fill: chartColors.primary }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="value"
                      stroke={chartColors.secondary}
                      strokeWidth={2}
                      dot={{ fill: chartColors.secondary }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>API request volume by endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  requests: {
                    label: "Requests",
                    color: chartColors.primary,
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={merchantDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                    <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: isDark ? "hsl(var(--background))" : "white",
                        border: `1px solid ${chartColors.grid}`,
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="value" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
