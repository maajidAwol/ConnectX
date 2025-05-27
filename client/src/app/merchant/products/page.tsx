"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Edit, Info, Package, Plus, Search, Trash, Loader2 } from "lucide-react"
import useProductStore, { type FilterType } from "@/store/useProductStore"
import { useAuthStore } from "@/store/authStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"
import { ListProductModal } from "@/components/modals/ListProductModal"
import type { Product } from "@/store/useProductStore"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTenantStore } from "@/store/tenantStore"

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
    filterType,
    listProduct,
    unlistProduct,
    deleteProduct,
  } = useProductStore()
  const { isAuthenticated, user, isTenantVerified } = useAuthStore()
  const { tenantData, fetchTenantData } = useTenantStore()
  const isVerified = tenantData?.is_verified || false
  const verificationStatus = tenantData?.tenant_verification_status || 'unverified'
  const [selectedTab, setSelectedTab] = useState<FilterType>("all")

  // Helper function to safely get category name
  const getCategoryName = (category: any): string => {
    if (!category) return "Uncategorized"
    if (typeof category === "string") return category
    if (typeof category === "object" && category.name) return category.name
    return "Uncategorized"
  }

  // Fetch products and tenant data on component mount
  useEffect(() => {
    fetchProducts()
    fetchTenantData()
  }, [fetchProducts, fetchTenantData])

  // Update filter type when tab changes
  const handleTabChange = (value: string) => {
    setSelectedTab(value as FilterType)
    setFilterType(value as FilterType)
  }

  // Helper function to get user ID
  function getUserId(): string {
    return user?.id || ""
  }

  // Helper function to get user tenant ID
  function getUserTenantId(): string {
    return user?.tenant || ""
  }

  // Generate pagination range with ellipsis for larger page sets
  const getPaginationRange = () => {
    if (totalPages <= 1) return []

    // Maximum number of page links to show (excluding ellipsis)
    const maxVisiblePages = 5
    const range = []

    // Always show first page
    range.push(1)

    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than our max, show all of them
      for (let i = 2; i <= totalPages; i++) {
        range.push(i)
      }
    } else {
      // We have more pages than we can display, need to use ellipsis
      // Always try to show current page with neighbors

      const leftBound = Math.max(2, currentPage - 1)
      const rightBound = Math.min(totalPages - 1, currentPage + 1)

      // Add ellipsis marker if needed on left side
      if (leftBound > 2) {
        range.push("...")
      }

      // Add visible page numbers around current page
      for (let i = leftBound; i <= rightBound; i++) {
        range.push(i)
      }

      // Add ellipsis marker if needed on right side
      if (rightBound < totalPages - 1) {
        range.push("...")
      }

      // Always show last page if we have more than 1 page
      if (totalPages > 1) {
        range.push(totalPages)
      }
    }

    return range
  }

  // Generate a debounced search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    // If "all" is selected, pass an empty string to reset the category filter
    setCategory(value === "all" ? "" : value)
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
          <Link href="/merchant/products/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Button>
          </Link>
        ) : (
          <Button disabled className="gap-2" title={
            verificationStatus === 'under_review' 
              ? 'Your business is under review. You cannot add products at this time.'
              : verificationStatus === 'rejected'
              ? 'Your business verification was rejected. Please resubmit for verification.'
              : verificationStatus === 'pending'
              ? 'Your business verification is pending. You cannot add products until verified.'
              : 'Your business is not verified. Please verify your business to add products.'
          }>
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        )}
      </div>

      {!isVerified && (
        <Alert className={
          verificationStatus === 'under_review' 
            ? "bg-blue-50 text-blue-800 border-blue-200"
            : verificationStatus === 'rejected'
            ? "bg-red-50 text-red-800 border-red-200"
            : verificationStatus === 'pending'
            ? "bg-yellow-50 text-yellow-800 border-yellow-200"
            : "bg-amber-50 text-amber-800 border-amber-200"
        }>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {verificationStatus === 'under_review' 
              ? 'Business Under Review'
              : verificationStatus === 'rejected'
              ? 'Verification Rejected'
              : verificationStatus === 'pending'
              ? 'Verification Pending'
              : 'Verification Required'
            }
          </AlertTitle>
          <AlertDescription>
            {verificationStatus === 'under_review' 
              ? 'Your business verification is currently under review. You cannot add new products until the review is complete. You can still manage existing products and use public products.'
              : verificationStatus === 'rejected'
              ? 'Your business verification was rejected. Please review the feedback and resubmit your verification documents. You can only use public products until verified.'
              : verificationStatus === 'pending'
              ? 'Your business verification is pending review. You cannot add new products until verification is approved. You can still use public products.'
              : 'Your business is not verified yet. Unverified merchants can only use public products.'
            }
            {(verificationStatus === 'unverified' || verificationStatus === 'rejected') && (
              <div className="mt-2">
                <Link href="/merchant/profile/verify">
                  <Button variant="outline" className={
                    verificationStatus === 'rejected'
                      ? "bg-white border-red-300 text-red-800 hover:bg-red-100"
                      : "bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
                  }>
                    {verificationStatus === 'rejected' ? 'Resubmit Verification' : 'Verify Your Business'}
                  </Button>
                </Link>
              </div>
            )}
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
                {isVerified ? (
                  <Link href="/merchant/products/add">
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Product</span>
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" className="gap-2" disabled title={
                    verificationStatus === 'under_review' 
                      ? 'Your business is under review. You cannot add products at this time.'
                      : verificationStatus === 'rejected'
                      ? 'Your business verification was rejected. Please resubmit for verification.'
                      : verificationStatus === 'pending'
                      ? 'Your business verification is pending. You cannot add products until verified.'
                      : 'Your business is not verified. Please verify your business to add products.'
                  }>
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-2">Category</div>
                      <div className="col-span-1">Price</div>
                      <div className="col-span-1">Stock</div>
                      <div className="col-span-2">Revenue</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    <div className="divide-y">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="grid grid-cols-12 items-center p-3">
                          <div className="col-span-4 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <div className="col-span-1">
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <div className="col-span-1">
                            <Skeleton className="h-4 w-8" />
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : products.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-2">Category</div>
                      <div className="col-span-1">Price</div>
                      <div className="col-span-1">Stock</div>
                      <div className="col-span-2">Revenue</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    <div className="divide-y">
                      {products.map((product) => (
                        <div key={product.id} className="grid grid-cols-12 items-center p-3">
                          <div className="col-span-4 flex items-center gap-3">
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
                              <Link href={`/merchant/products/${product.id}`} className="hover:underline">
                                <div className="font-medium">{product.name || "Unnamed Product"}</div>
                              </Link>
                              <div className="text-sm text-muted-foreground">{product.sku || "No SKU"}</div>
                            </div>
                          </div>
                          <div className="col-span-2">{getCategoryName(product.category)}</div>
                          <div className="col-span-1">${product.selling_price}</div>
                          <div className="col-span-1">{product.quantity}</div>
                          <div className="col-span-2">
                            ${(Number.parseFloat(product.selling_price) * product.total_sold).toFixed(2)}
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <div className="flex items-center gap-2">
                              <Link href={`/merchant/products/${product.id}`}>
                                <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </Link>
                              <Link href={`/merchant/products/add?id=${product.id}`}>
                                <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800"
                              >
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
                      {isVerified ? (
                        <Link href="/merchant/products/add">
                          <Button className="mt-4 gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Add Your First Product</span>
                          </Button>
                        </Link>
                      ) : (
                        <Button className="mt-4 gap-2" disabled title={
                          verificationStatus === 'under_review' 
                            ? 'Your business is under review. You cannot add products at this time.'
                            : verificationStatus === 'rejected'
                            ? 'Your business verification was rejected. Please resubmit for verification.'
                            : verificationStatus === 'pending'
                            ? 'Your business verification is pending. You cannot add products until verified.'
                            : 'Your business is not verified. Please verify your business to add products.'
                        }>
                          <Plus className="h-4 w-4" />
                          <span>Add Your First Product</span>
                        </Button>
                      )}
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
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {getPaginationRange().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(Number(page))
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
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
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
  title: string
  description: string
  isLoading: boolean
  products: any[]
  isVerified: boolean
  getUserId: () => string
  showStatus?: boolean
  showSales?: boolean
  showActions?: boolean
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
  showActions = false,
}: ProductListCardProps) {
  const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({})
  const [deletingProducts, setDeletingProducts] = useState<Record<string, boolean>>({})
  const [unlistingProducts, setUnlistingProducts] = useState<Record<string, boolean>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const { user } = useAuthStore()
  const currentTenantId = user?.tenant
  const { listProduct, unlistProduct, deleteProduct } = useProductStore()

  // Helper function to safely get category name
  const getCategoryName = (category: any): string => {
    if (!category) return "Uncategorized"
    if (typeof category === "string") return category
    if (typeof category === "object" && category.name) return category.name
    return "Uncategorized"
  }

  const handleListProduct = async (productId: string, profitPercentage: number) => {
    try {
      setLoadingProducts((prev) => ({ ...prev, [productId]: true }))
      await listProduct(productId, profitPercentage)
    } catch (error) {
      console.error("Error listing product:", error)
      throw error
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleUnlistProduct = async (product: any) => {
    try {
      setUnlistingProducts((prev) => ({ ...prev, [product.id]: true }))
      const data = await unlistProduct(product.id)
      toast.success(data.detail || "Product unlisted successfully", { className: "bg-[#02569B] text-white" })
    } catch (error) {
      console.error("Error unlisting product:", error)
      toast.error("Failed to unlist product. Please try again.", { className: "bg-red-500 text-white" })
    } finally {
      setUnlistingProducts((prev) => ({ ...prev, [product.id]: false }))
    }
  }

  const handleDeleteProduct = async (product: any) => {
    try {
      setDeletingProducts((prev) => ({ ...prev, [product.id]: true }))
      const data = await deleteProduct(product.id)
      toast.success(data.detail || "Product deleted successfully", { className: "bg-[#02569B] text-white" })
      setProductToDelete(null)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product. Please try again.", { className: "bg-red-500 text-white" })
    } finally {
      setDeletingProducts((prev) => ({ ...prev, [product.id]: false }))
    }
  }

  const isProductListed = (product: any) => {
    return product.tenant?.includes(currentTenantId)
  }

  const isProductOwned = (product: any) => {
    return product.owner === user?.tenant
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1">Stock</div>
                <div className="col-span-2">{showSales ? "Sales" : showStatus ? "Status" : "Sales"}</div>
                <div className="col-span-2">Actions</div>
              </div>
              <div className="divide-y">
                {Array.from({ length: 10 }, (_, index) => (
                  <div key={index + 1} className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-4 flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="col-span-1">
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="col-span-1">
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-16 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1">Stock</div>
                <div className="col-span-2">{showSales ? "Sales" : showStatus ? "Status" : "Sales"}</div>
                <div className="col-span-2">Actions</div>
              </div>
              <div className="divide-y">
                {products.length > 0 ? (
                  products.map((product) => {
                    if (!product || typeof product !== "object") {
                      return null
                    }

                    const isListed = isProductListed(product)
                    const isLoading = loadingProducts[product.id]
                    const isOwned = isProductOwned(product)

                    return (
                      <div key={product.id} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-4 flex items-center gap-3">
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
                            <Link href={`/merchant/products/${product.id}`} className="hover:underline">
                              <div className="font-medium">{product.name || "Unnamed Product"}</div>
                            </Link>
                            <div className="text-sm text-muted-foreground">{product.sku || "No SKU"}</div>
                          </div>
                        </div>
                        <div className="col-span-2">{getCategoryName(product.category)}</div>
                        <div className="col-span-1">{product.base_price || "0.00"} ETB</div>
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
                        <div className="col-span-2 flex items-center justify-start gap-2">
                          {isOwned && (
                            <>
                              <div className="flex gap-1">
                                <Link href={`/merchant/products/${product.id}`}>
                                  <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                </Link>
                                <Link href={`/merchant/products/add?id=${product.id}`}>
                                  <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setProductToDelete(product)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  {isLoading ? (
                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ):
                                  (<Trash className="h-4 w-4" />)
                                  }
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </>
                          )}
                          {!isOwned && (
                            
                            <Link href={`/merchant/products/${product.id}`}>
                              <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                                <Info className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </Link>
                          )}
                          {isListed ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnlistProduct(product)}
                              className="text-red-600 hover:text-red-800 ml-2"
                              disabled={unlistingProducts[product.id]}
                            >
                              {unlistingProducts[product.id] ? (
                                <>
                                  {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                                  Unlisting...
                                </>
                              ) : (
                                "Unlist"
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                              className="text-blue-600 hover:text-blue-800 ml-2"
                              disabled={loadingProducts[product.id]}
                            >
                              List
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No products found matching your search.</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ListProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onList={handleListProduct}
      />

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              {productToDelete?.name ? ` "${productToDelete.name}"` : ""} and remove it from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingProducts[productToDelete?.id || '']}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletingProducts[productToDelete?.id || '']}
            >
              {deletingProducts[productToDelete?.id || ''] ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
