import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"
import { LayoutDashboard, Package, ShoppingCart, Users, Box, BarChart3, Tag, Settings, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
  return (
    <DashboardLayout
      title="Stock"
      description="Loading product stock levels..."
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
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-24" />
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16" />
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

