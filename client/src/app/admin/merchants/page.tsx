"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Building2,
  Code2,
  HelpCircle,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Users,
  BarChart3,
  Activity,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"

const navigation = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Merchants",
    href: "/admin/merchants",
    icon: Building2,
    badge: 3,
  },
  {
    title: "Developers",
    href: "/admin/developers",
    icon: Code2,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "System Health",
    href: "/admin/system-health",
    icon: Activity,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: ShieldAlert,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/admin/help",
    icon: HelpCircle,
  },
]

const merchants = [
  {
    id: 1,
    name: "Acme Corp",
    email: "acme@example.com",
    products: 128,
    revenue: "$45,289",
    joined: "Jan 12, 2023",
    status: "Active",
  },
  {
    id: 2,
    name: "Global Gadgets",
    email: "global@example.com",
    products: 256,
    revenue: "$98,546",
    joined: "Mar 5, 2022",
    status: "Active",
  },
  {
    id: 3,
    name: "Tech Innovations",
    email: "tech@example.com",
    products: 0,
    revenue: "$0",
    joined: "Today",
    status: "Pending",
  },
]

export default function AdminMerchantsPage() {
  const [search, setSearch] = useState("")

  return (
    <DashboardLayout
      title="Merchant Management"
      description="View and manage all merchants on the platform"
      role="admin"
      navigation={navigation}
    >
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merchants</CardTitle>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search merchants..."
                className="w-full rounded-md border bg-background pl-8 md:w-64 lg:w-80"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                      >
                        {merchant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{merchant.products}</TableCell>
                    <TableCell>{merchant.revenue}</TableCell>
                    <TableCell>{merchant.joined}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

