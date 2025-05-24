"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"

// Dummy data for charts
const revenueData = [
  { month: "Jan", revenue: 45000, target: 40000 },
  { month: "Feb", revenue: 52000, target: 45000 },
  { month: "Mar", revenue: 48000, target: 50000 },
  { month: "Apr", revenue: 61000, target: 55000 },
  { month: "May", revenue: 55000, target: 60000 },
  { month: "Jun", revenue: 67000, target: 65000 },
]

const merchantDistributionData = [
  { name: "E-commerce", value: 45, color: "hsl(var(--char-1))" },
  { name: "SaaS", value: 30, color: "hsl(var(--))" },
  { name: "Marketplace", value: 15, color: "hsl(var(--accent))" },
  { name: "Others", value: 10, color: "hsl(var(--muted))" },
]

const merchantGrowthData = [
  { month: "Jan", new: 245, churned: 23 },
  { month: "Feb", new: 312, churned: 18 },
  { month: "Mar", new: 289, churned: 31 },
  { month: "Apr", new: 356, churned: 25 },
  { month: "May", new: 423, churned: 19 },
  { month: "Jun", new: 398, churned: 28 },
]

const transactionData = [
  { day: "Mon", volume: 1250, value: 125000 },
  { day: "Tue", volume: 1890, value: 189000 },
  { day: "Wed", volume: 2100, value: 210000 },
  { day: "Thu", volume: 1750, value: 175000 },
  { day: "Fri", volume: 2300, value: 230000 },
  { day: "Sat", volume: 1950, value: 195000 },
  { day: "Sun", volume: 1650, value: 165000 },
]

const apiUsageData = [
  { endpoint: "Payments", requests: 45000, growth: 12 },
  { endpoint: "Merchants", requests: 23000, growth: 8 },
  { endpoint: "Products", requests: 18000, growth: -3 },
  { endpoint: "Analytics", requests: 12000, growth: 15 },
  { endpoint: "Webhooks", requests: 8000, growth: 5 },
]

export default function AdminAnalytics() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const chartColors = {
    primary: isDark ? 'hsl(var(--primary))' : 'hsl(var(--primary))',
    secondary: isDark ? 'hsl(var(--secondary))' : 'hsl(var(--secondary))',
    accent: isDark ? 'hsl(var(--accent))' : 'hsl(var(--accent))',
    muted: isDark ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
    grid: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
    text: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
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
                    target: {
                      label: "Target",
                      color: chartColors.secondary,
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                      <XAxis 
                        dataKey="month" 
                        stroke={chartColors.text}
                        tick={{ fill: chartColors.text }}
                      />
                      <YAxis 
                        stroke={chartColors.text}
                        tick={{ fill: chartColors.text }}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: isDark ? 'hsl(var(--background))' : 'white',
                          border: `1px solid ${chartColors.grid}`,
                          borderRadius: '6px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={chartColors.primary}
                        strokeWidth={2}
                        dot={{ fill: chartColors.primary }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke={chartColors.secondary}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: chartColors.secondary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Merchant Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    ecommerce: {
                      label: "E-commerce",
                      color: chartColors.primary,
                    },
                    saas: {
                      label: "SaaS",
                      color: chartColors.secondary,
                    },
                    marketplace: {
                      label: "Marketplace",
                      color: chartColors.accent,
                    },
                    others: {
                      label: "Others",
                      color: chartColors.muted,
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: isDark ? 'hsl(var(--background))' : 'white',
                          border: `1px solid ${chartColors.grid}`,
                          borderRadius: '6px',
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
              <CardTitle>Merchant Growth</CardTitle>
              <CardDescription>Monthly merchant acquisition and churn</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  new: {
                    label: "New Merchants",
                    color: chartColors.primary,
                  },
                  churned: {
                    label: "Churned",
                    color: chartColors.secondary,
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={merchantGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis 
                      dataKey="month" 
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <YAxis 
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: isDark ? 'hsl(var(--background))' : 'white',
                        border: `1px solid ${chartColors.grid}`,
                        borderRadius: '6px',
                      }}
                    />
                    <Bar dataKey="new" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="churned" fill={chartColors.secondary} radius={[4, 4, 0, 0]} />
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
                    <XAxis 
                      dataKey="day" 
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: isDark ? 'hsl(var(--background))' : 'white',
                        border: `1px solid ${chartColors.grid}`,
                        borderRadius: '6px',
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
                  growth: {
                    label: "Growth %",
                    color: chartColors.secondary,
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={apiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis 
                      dataKey="endpoint" 
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      stroke={chartColors.text}
                      tick={{ fill: chartColors.text }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: isDark ? 'hsl(var(--background))' : 'white',
                        border: `1px solid ${chartColors.grid}`,
                        borderRadius: '6px',
                      }}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="requests" 
                      fill={chartColors.primary} 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="growth"
                      stroke={chartColors.secondary}
                      strokeWidth={2}
                      dot={{ fill: chartColors.secondary }}
                    />
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
