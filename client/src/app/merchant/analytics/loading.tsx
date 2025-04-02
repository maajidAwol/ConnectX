"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LayoutDashboard, Package, ShoppingCart, Users, Box, BarChart3, Tag, Settings, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
  return (
    <DashboardLayout
      role="merchant"
      navigation={[
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
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

