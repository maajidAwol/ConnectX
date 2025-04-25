"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Edit, Filter, Info, MoreHorizontal, Package, Plus, Search, Trash } from "lucide-react"
import { products, isMerchantVerified } from "@/lib/data"

export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const isVerified = isMerchantVerified()

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Separate centrally listed and merchant products
  const centralProducts = filteredProducts.filter((product) => product.centrallyListed)
  const merchantProducts = filteredProducts.filter((product) => !product.centrallyListed)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        {isVerified ? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        ) : (
          <Button disabled className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        )}
      </div>

      {!isVerified && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            Your business is not verified yet. Unverified merchants can only use centrally listed products.
            <div className="mt-2">
              <Link href="/merchant/profile/verify">
                <Button variant="outline" className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100">
                  Verify Your Business
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

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

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="apparel">Apparel</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          {/* <TabsTrigger value="central">Centrally Listed</TabsTrigger> */}
          <TabsTrigger value="public">Public Products</TabsTrigger>
          <TabsTrigger value="owned">Owned Products</TabsTrigger>
          <TabsTrigger value="listed">Listed</TabsTrigger>
          {isVerified && <TabsTrigger value="merchant">My Products</TabsTrigger>}
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
              <CardDescription>View and manage all available products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-1">Stock</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-5 flex items-center gap-3">
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
                            <div className="text-sm text-muted-foreground">{product.sku}</div>
                          </div>
                        </div>
                        <div className="col-span-2">{product.category}</div>
                        <div className="col-span-1">${product.price}</div>
                        <div className="col-span-1">{product.stock}</div>
                        <div className="col-span-2">
                          {product.centrallyListed ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Centrally Listed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              My Product
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" disabled={!isVerified && !product.centrallyListed}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" disabled={!isVerified && !product.centrallyListed}>
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No products found matching your search.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listed">
          <Card>
            <CardHeader>
              <CardTitle>Listed Products</CardTitle>
              <CardDescription>Products available from the ConnectX marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-1">Stock</div>
                  <div className="col-span-2">Sales</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {centralProducts.length > 0 ? (
                    centralProducts.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-5 flex items-center gap-3">
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
                            <div className="text-sm text-muted-foreground">{product.sku}</div>
                          </div>
                        </div>
                        <div className="col-span-2">{product.category}</div>
                        <div className="col-span-1">${product.price}</div>
                        <div className="col-span-1">{product.stock}</div>
                        <div className="col-span-2">{product.sales} units</div>
                        <div className="col-span-1 flex justify-end">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Package className="h-4 w-4" />
                              <span className="sr-only">Add to My Store</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Details</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No centrally listed products found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isVerified && (
          <TabsContent value="merchant">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>My Products</CardTitle>
                  <CardDescription>Products you've added to your store</CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </Button>
              </CardHeader>
              <CardContent>
                {merchantProducts.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                      <div className="col-span-5">Product</div>
                      <div className="col-span-2">Category</div>
                      <div className="col-span-1">Price</div>
                      <div className="col-span-1">Stock</div>
                      <div className="col-span-2">Revenue</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {merchantProducts.map((product) => (
                        <div key={product.id} className="grid grid-cols-12 items-center p-3">
                          <div className="col-span-5 flex items-center gap-3">
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
                              <div className="text-sm text-muted-foreground">{product.sku}</div>
                            </div>
                          </div>
                          <div className="col-span-2">{product.category}</div>
                          <div className="col-span-1">${product.price}</div>
                          <div className="col-span-1">{product.stock}</div>
                          <div className="col-span-2">{product.revenue}</div>
                          <div className="col-span-1 flex justify-end">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-2">
                      <div className="rounded-full bg-muted p-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">No products added yet</h3>
                      <p className="text-sm text-muted-foreground">
                        You haven't added any of your own products yet. Add your first product to start selling.
                      </p>
                      <Button className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Your First Product</span>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
