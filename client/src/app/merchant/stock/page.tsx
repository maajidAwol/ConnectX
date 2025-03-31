"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Box, HelpCircle, LayoutDashboard, Package, Settings, ShoppingCart, Tag, Users, BarChart3 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"

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

const products = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    category: "Audio",
    price: 129.99,
    stock: 142,
    visibility: "Public",
  },
  {
    id: 2,
    name: "Smart Watch X2",
    category: "Wearables",
    price: 249.99,
    stock: 98,
    visibility: "Public",
  },
  {
    id: 3,
    name: "Portable Charger 20000mAh",
    category: "Accessories",
    price: 49.99,
    stock: 87,
    visibility: "Public",
  },
  {
    id: 4,
    name: "Bluetooth Speaker Mini",
    category: "Audio",
    price: 79.99,
    stock: 76,
    visibility: "Private",
  },
  {
    id: 5,
    name: "Ultra HD Camera",
    category: "Photography",
    price: 399.99,
    stock: 32,
    visibility: "Public",
  },
]

export default function MerchantStockPage() {
  const [search, setSearch] = useState("")

  return (
    <DashboardLayout role="merchant" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
          <p className="text-muted-foreground">Manage your product stock levels</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full rounded-md border bg-background pl-8 md:w-64 lg:w-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button>Add New Product</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                      >
                        {product.visibility}
                      </Badge>
                    </TableCell>
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

