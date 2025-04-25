"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertCircle,
  ArrowUpDown,
  Filter,
  Package,
  Plus,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { products } from "@/lib/data"

export default function StockManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()

    // Stock filter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.stock <= 5) ||
      (stockFilter === "medium" && product.stock > 5 && product.stock <= 20) ||
      (stockFilter === "high" && product.stock > 20)

    return matchesSearch && matchesCategory && matchesStock
  })

  // Count products by stock level
  const lowStockCount = products.filter((p) => p.stock <= 5).length
  const mediumStockCount = products.filter((p) => p.stock > 5 && p.stock <= 20).length
  const highStockCount = products.filter((p) => p.stock > 20).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stock Management</h2>
          <p className="text-muted-foreground">Monitor and manage your inventory levels</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Sync Inventory</span>
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Stock</span>
          </Button>
        </div>
      </div>

      {lowStockCount > 0 && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            You have {lowStockCount} products with low stock levels that need attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Products with 5 or fewer units</p>
            <Progress value={(lowStockCount / products.length) * 100} className="mt-2 h-1 bg-amber-100" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Stock</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediumStockCount}</div>
            <p className="text-xs text-muted-foreground">Products with 6-20 units</p>
            <Progress value={(mediumStockCount / products.length) * 100} className="mt-2 h-1 bg-blue-100" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Well Stocked</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highStockCount}</div>
            <p className="text-xs text-muted-foreground">Products with more than 20 units</p>
            <Progress value={(highStockCount / products.length) * 100} className="mt-2 h-1 bg-green-100" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>

          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="apparel">Apparel</option>
          </select>

          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="medium">Medium Stock</option>
            <option value="high">Well Stocked</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="low">Low Stock</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current stock levels for all products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-4 flex items-center gap-2">
                    <span>Product</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div className="col-span-2">SKU</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1 text-center">Price</div>
                  <div className="col-span-1 text-center flex items-center gap-2 justify-center">
                    <span>Stock</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.sales} units sold this month</div>
                          </div>
                        </div>
                        <div className="col-span-2 text-sm">{product.sku}</div>
                        <div className="col-span-2">{product.category}</div>
                        <div className="col-span-1 text-center">${product.price}</div>
                        <div className="col-span-1 text-center">
                          <Badge
                            variant="outline"
                            className={
                              product.stock <= 5
                                ? "bg-red-50 text-red-700 border-red-200"
                                : product.stock <= 20
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-green-50 text-green-700 border-green-200"
                            }
                          >
                            {product.stock}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Adjust
                          </Button>
                          <Button variant="outline" size="sm">
                            Restock
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No products found matching your criteria.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Products that need immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">SKU</div>
                  <div className="col-span-1 text-center">Stock</div>
                  <div className="col-span-2 text-center">Sales Trend</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {products
                    .filter((p) => p.stock <= 5)
                    .map((product) => (
                      <div key={product.id} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-red-600">Critical stock level</div>
                          </div>
                        </div>
                        <div className="col-span-2">{product.sku}</div>
                        <div className="col-span-1 text-center">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {product.stock}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {product.sales > 50 ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">High demand</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4 text-amber-600" />
                                <span className="text-sm text-amber-600">Moderate</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="col-span-3 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Order History
                          </Button>
                          <Button size="sm">Restock Now</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorder">
          <Card>
            <CardHeader>
              <CardTitle>Reorder Suggestions</CardTitle>
              <CardDescription>Smart reordering recommendations based on sales trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-1 text-center">Current</div>
                  <div className="col-span-2 text-center">Recommended</div>
                  <div className="col-span-2">Monthly Sales</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {products
                    .filter((p) => p.stock < p.sales / 2) // Simple algorithm: reorder if stock is less than half of monthly sales
                    .sort((a, b) => a.stock / a.sales - b.stock / b.sales) // Sort by urgency
                    .map((product) => {
                      // Calculate recommended reorder amount
                      const recommendedStock = Math.max(product.sales, 20) // At least monthly sales or 20 units
                      const reorderAmount = recommendedStock - product.stock

                      return (
                        <div key={product.id} className="grid grid-cols-12 items-center p-3">
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">{product.sku}</div>
                            </div>
                          </div>
                          <div className="col-span-1 text-center">
                            <Badge
                              variant="outline"
                              className={
                                product.stock <= 5
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            >
                              {product.stock}
                            </Badge>
                          </div>
                          <div className="col-span-2 text-center">
                            <div className="font-medium">+{reorderAmount} units</div>
                            <div className="text-xs text-muted-foreground">Target: {recommendedStock} total</div>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span>{product.sales} units/month</span>
                            </div>
                          </div>
                          <div className="col-span-3 flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Adjust Quantity
                            </Button>
                            <Button size="sm">Order Now</Button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
