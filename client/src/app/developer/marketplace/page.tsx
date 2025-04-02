"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Book,
  Code,
  Compass,
  FileCode,
  HelpCircle,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"

const navigation = [
  {
    title: "Dashboard",
    href: "/developer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    href: "/developer/marketplace",
    icon: Compass,
  },
  {
    title: "My Integrations",
    href: "/developer/integrations",
    icon: Code,
  },
  {
    title: "API Explorer",
    href: "/developer/api-explorer",
    icon: Terminal,
  },
  {
    title: "Projects",
    href: "/developer/projects",
    icon: FileCode,
  },
  {
    title: "Documentation",
    href: "/developer/documentation",
    icon: Book,
  },
  {
    title: "Security",
    href: "/developer/security",
    icon: ShieldCheck,
  },
  {
    title: "Settings",
    href: "/developer/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/developer/help",
    icon: HelpCircle,
  },
]

const integrations = [
  {
    id: 1,
    merchant: "Global Gadgets",
    product: "Product API",
    status: "Active",
    apiUsage: "450K requests/month",
    lastUsed: "2 minutes ago",
  },
  {
    id: 2,
    merchant: "Fashion Forward",
    product: "Catalog API",
    status: "Active",
    apiUsage: "320K requests/month",
    lastUsed: "15 minutes ago",
  },
  {
    id: 3,
    merchant: "Acme Corp",
    product: "Order API",
    status: "Active",
    apiUsage: "280K requests/month",
    lastUsed: "42 minutes ago",
  },
  {
    id: 4,
    merchant: "Tech Innovations",
    product: "Inventory API",
    status: "Active",
    apiUsage: "150K requests/month",
    lastUsed: "1 hour ago",
  },
]

export default function Marketplace() {
  const [search, setSearch] = useState("")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">Browse and manage your merchant product integrations</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Integrations</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search integrations..."
                className="w-full rounded-md border bg-background pl-8 md:w-64 lg:w-80"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button>Add New Integration</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>API Usage</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell className="font-medium">{integration.merchant}</TableCell>
                  <TableCell>{integration.product}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                    >
                      {integration.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{integration.apiUsage}</TableCell>
                  <TableCell>{integration.lastUsed}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

