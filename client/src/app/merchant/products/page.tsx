"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, ChevronRight, Edit, Filter, Info, MoreHorizontal, Package, Plus, Search, Trash } from "lucide-react"
import useProductStore, { FilterType } from "@/store/useProductStore"
import { useAuthStore } from "@/store/authStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export default function ProductManagement() {
  const { 
    products, 
    isLoading, 
    error, 
    searchQuery, 
    fetchProducts, 
    setSearchQuery, 
    setFilterType,
    setCategory,
    setCurrentPage,
    currentPage,
    totalPages,
    filterType
  } = useProductStore()
  const { isAuthenticated, user } = useAuthStore()
  const isVerified = user?.is_verified || false
  const [selectedTab, setSelectedTab] = useState<FilterType>("all")

  // Helper function to safely get category name
  const getCategoryName = (category: any): string => {
    if (!category) return "Uncategorized";
    if (typeof category === "string") return category;
    if (typeof category === "object" && category.name) return category.name;
    return "Uncategorized";
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Update filter type when tab changes
  const handleTabChange = (value: string) => {
    setSelectedTab(value as FilterType)
    setFilterType(value as FilterType)
  }

  // Helper function to get user ID
  function getUserId(): string {
    return user?.id || ''
  }

  // Helper function to get user tenant ID
  function getUserTenantId(): string {
    return user?.tenant || ''
  }

  // Generate pagination range with ellipsis for larger page sets
  const getPaginationRange = () => {
    if (totalPages <= 1) return [];

    // Maximum number of page links to show (excluding ellipsis)
    const maxVisiblePages = 5;
    const range = [];
    
    // Always show first page
    range.push(1);
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than our max, show all of them
      for (let i = 2; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // We have more pages than we can display, need to use ellipsis
      // Always try to show current page with neighbors
      
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis marker if needed on left side
      if (leftBound > 2) {
        range.push('...');
      }
      
      // Add visible page numbers around current page
      for (let i = leftBound; i <= rightBound; i++) {
        range.push(i);
      }
      
      // Add ellipsis marker if needed on right side
      if (rightBound < totalPages - 1) {
        range.push('...');
      }
      
      // Always show last page if we have more than 1 page
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }
    
    return range;
  };

  // Generate a debounced search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    // If "all" is selected, pass an empty string to reset the category filter
    setCategory(value === 'all' ? '' : value);
  }

  // if (!isAuthenticated) {
  //   return (
  //     <div className="space-y-6">
  //       <Alert className="bg-amber-50 text-amber-800 border-amber-200">
  //         <AlertCircle className="h-4 w-4" />
  //         <AlertTitle>Authentication Required</AlertTitle>
  //         <AlertDescription>
  //           You need to login to view and manage products.
  //           <div className="mt-2">
  //             <Link href="/login">
  //               <Button variant="outline" className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100">
  //                 Login to Your Account
  //               </Button>
  //             </Link>
  //           </div>
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   )
  // }

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
            Your business is not verified yet. Unverified merchants can only use public products.
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
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
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="public">Public Products</TabsTrigger>
          <TabsTrigger value="owned">Owned Products</TabsTrigger>
          <TabsTrigger value="listed">Listed</TabsTrigger>
          {isVerified && <TabsTrigger value="merchant">My Products</TabsTrigger>}
        </TabsList>

        <TabsContent value="all">
          <ProductListCard 
            title="All Products" 
            description="View and manage all available products"
            isLoading={isLoading}
            products={products}
            isVerified={isVerified}
            getUserId={getUserId}
            showStatus={true}
          />
        </TabsContent>

        <TabsContent value="public">
          <ProductListCard 
            title="Public Products" 
            description="Products available from the ConnectX marketplace"
            isLoading={isLoading}
            products={products}
            isVerified={isVerified}
            getUserId={getUserId}
            showStatus={false}
            showSales={true}
          />
        </TabsContent>

        <TabsContent value="owned">
          <ProductListCard 
            title="Owned Products" 
            description="Products you've created"
            isLoading={isLoading}
            products={products}
            isVerified={isVerified}
            getUserId={getUserId}
            showStatus={false}
            showSales={true}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="listed">
          <ProductListCard 
            title="Listed Products" 
            description="Products available in your store"
            isLoading={isLoading}
            products={products}
            isVerified={isVerified}
            getUserId={getUserId}
            showStatus={false}
            showSales={true}
          />
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
                {isLoading ? (
                  <div className="p-8 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
                  </div>
                ) : products.length > 0 ? (
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
                      {products.map((product) => (
                        <div key={product.id} className="grid grid-cols-12 items-center p-3">
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                              <Image
                                src={product.cover_url || "/placeholder.svg"}
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
                          <div className="col-span-2">{getCategoryName(product.category)}</div>
                          <div className="col-span-1">${product.selling_price}</div>
                          <div className="col-span-1">{product.quantity}</div>
                          <div className="col-span-2">${(parseFloat(product.selling_price) * product.total_sold).toFixed(2)}</div>
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

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {getPaginationRange().map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2">...</span>
                ) : (
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(Number(page));
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

// Reusable card component for product lists
interface ProductListCardProps {
  title: string;
  description: string;
  isLoading: boolean;
  products: any[];
  isVerified: boolean;
  getUserId: () => string;
  showStatus?: boolean;
  showSales?: boolean;
  showActions?: boolean;
}

function ProductListCard({
  title,
  description,
  isLoading,
  products,
  isVerified,
  getUserId,
  showStatus = false,
  showSales = false,
  showActions = false
}: ProductListCardProps) {
  // Helper function to safely get category name
  const getCategoryName = (category: any): string => {
    if (!category) return "Uncategorized";
    if (typeof category === "string") return category;
    if (typeof category === "object" && category.name) return category.name;
    return "Uncategorized";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
              <div className="col-span-5">Product</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-2">{showSales ? "Sales" : (showStatus ? "Status" : "Sales")}</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {products.length > 0 ? (
                products.map((product) => {
                  // Ensure we're working with a valid product object
                  if (!product || typeof product !== 'object') {
                    return null;
                  }

                  return (
                    <div key={product.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                          <Image
                            src={product.cover_url || "/placeholder.svg"}
                            alt={product.name || "Product image"}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name || "Unnamed Product"}</div>
                          <div className="text-sm text-muted-foreground">{product.sku || "No SKU"}</div>
                        </div>
                      </div>
                      <div className="col-span-2">{getCategoryName(product.category)}</div>
                      <div className="col-span-1">${product.selling_price || "0.00"}</div>
                      <div className="col-span-1">{product.quantity || 0}</div>
                      <div className="col-span-2">
                        {showStatus ? (
                          product.is_public ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Public
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Private
                            </Badge>
                          )
                        ) : (
                          <span>{product.total_sold || 0} units</span>
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <div className="flex items-center gap-2">
                          {showActions ? (
                            <>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" disabled={!isVerified && product.owner !== getUserId()}>
                                {product.owner !== getUserId() ? (
                                  <Package className="h-4 w-4" />
                                ) : (
                                  <Edit className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {product.owner !== getUserId() ? "Add to Store" : "Edit"}
                                </span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Info className="h-4 w-4" />
                                <span className="sr-only">Details</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No products found matching your search.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
