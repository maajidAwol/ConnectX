"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Box,
  Eye,
  EyeOff,
  Filter,
  HelpCircle,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Tag,
  Trash,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function ProductsPage() {
  return (
    <DashboardLayout role="merchant" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">Manage your product catalog and control product visibility.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="w-full pl-8" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Category</DropdownMenuItem>
                <DropdownMenuItem>Price Range</DropdownMenuItem>
                <DropdownMenuItem>Stock Status</DropdownMenuItem>
                <DropdownMenuItem>Visibility</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button className="w-full md:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Product Catalog</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription>Manage your products and their visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Wireless Earbuds Pro</TableCell>
                      <TableCell>Audio</TableCell>
                      <TableCell>$129.99</TableCell>
                      <TableCell>142</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Public
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Make Private</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Smart Watch X2</TableCell>
                      <TableCell>Wearables</TableCell>
                      <TableCell>$249.99</TableCell>
                      <TableCell>98</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Public
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Make Private</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Portable Charger 20000mAh</TableCell>
                      <TableCell>Accessories</TableCell>
                      <TableCell>$49.99</TableCell>
                      <TableCell>87</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Public
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Make Private</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Bluetooth Speaker Mini</TableCell>
                      <TableCell>Audio</TableCell>
                      <TableCell>$79.99</TableCell>
                      <TableCell>76</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-800 dark:bg-slate-800/20 dark:text-slate-400"
                        >
                          Private
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Make Public</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Ultra HD Camera</TableCell>
                      <TableCell>Photography</TableCell>
                      <TableCell>$399.99</TableCell>
                      <TableCell>32</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                        >
                          Public
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Make Private</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Gaming Headset Pro</TableCell>
                      <TableCell>Gaming</TableCell>
                      <TableCell>$129.99</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-800 dark:bg-slate-800/20 dark:text-slate-400"
                        >
                          Private
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Make Public</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="public" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Public Products</CardTitle>
                <CardDescription>Products visible to developers and customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Wireless Earbuds Pro</TableCell>
                      <TableCell>Audio</TableCell>
                      <TableCell>$129.99</TableCell>
                      <TableCell>142</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Make Private</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Smart Watch X2</TableCell>
                      <TableCell>Wearables</TableCell>
                      <TableCell>$249.99</TableCell>
                      <TableCell>98</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Make Private</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Portable Charger 20000mAh</TableCell>
                      <TableCell>Accessories</TableCell>
                      <TableCell>$49.99</TableCell>
                      <TableCell>87</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Make Private</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Ultra HD Camera</TableCell>
                      <TableCell>Photography</TableCell>
                      <TableCell>$399.99</TableCell>
                      <TableCell>32</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Make Private</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="private" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Private Products</CardTitle>
                <CardDescription>Products only visible to you and your team</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Bluetooth Speaker Mini</TableCell>
                      <TableCell>Audio</TableCell>
                      <TableCell>$79.99</TableCell>
                      <TableCell>76</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Make Public</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Gaming Headset Pro</TableCell>
                      <TableCell>Gaming</TableCell>
                      <TableCell>$129.99</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Make Public</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="out-of-stock" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Out of Stock Products</CardTitle>
                <CardDescription>Products that need stock replenishment</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                      </TableCell>
                      <TableCell className="font-medium">Gaming Headset Pro</TableCell>
                      <TableCell>Gaming</TableCell>
                      <TableCell>$129.99</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-800 dark:bg-slate-800/20 dark:text-slate-400"
                        >
                          Private
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

