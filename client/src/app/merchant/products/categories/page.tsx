"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { CategoryListItem } from "@/components/categories/category-list-item"
import { CategoryTips } from "@/components/categories/category-tips"
import { AddCategoryDialog } from "@/components/categories/add-category-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import useCategoryStore from "@/store/useCategoryStore"
// import { useAuthStore } from "@/store/authStore"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useTenantStore } from "@/store/tenantStore"

export default function ProductCategories() {
  const { 
    categories, 
    isLoading, 
    error,
    searchQuery,
    currentPage,
    totalPages,
    setSearchQuery,
    setCurrentPage,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategoryStore()
  
  // const { isAuthenticated, user, isTenantVerified } = useAuthStore()
  const { tenantData, fetchTenantData } = useTenantStore()
  const isVerified = tenantData?.is_verified || false
  const verificationStatus = tenantData?.tenant_verification_status || 'unverified'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery)

  console.log(isVerified)

  // Fetch categories and tenant data on component mount
  useEffect(() => {
    fetchCategories()
    fetchTenantData()
  }, [fetchCategories, fetchTenantData])

  // Add a new category
  const handleAddCategory = async (data: {
    name: string
    description: string
    icon?: File
    parent?: string
  }) => {
    setIsSubmitting(true)
    try {
      // Add the category via the store
      await addCategory(data)
      
      // Refresh categories from backend to get the latest data
      // Reset to first page to see the new category
      setCurrentPage(1)
      await fetchCategories({ page: 1, search: searchQuery })
      
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update an existing category
  const handleUpdateCategory = async (id: string, data: {
    name: string
    description: string
    icon?: File
    parent?: string
  }) => {
    setIsSubmitting(true)
    try {
      // Update the category via the store
      await updateCategory(id, data)
      
      // Refresh categories from backend to get the latest data
      await fetchCategories({ page: currentPage, search: searchQuery })
      
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete a category
  const handleDeleteCategory = async (id: string) => {
    setIsSubmitting(true)
    try {
      // Delete the category via the store
      await deleteCategory(id)
      
      // Refresh categories from backend to get the latest data
      await fetchCategories({ page: currentPage, search: searchQuery })
      
    } finally {
      setIsSubmitting(false)
    }
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

  useEffect(() => {
    setLocalSearchValue(searchQuery)
  }, [searchQuery])

  // if (!isAuthenticated) {
  //   return (
  //     <div className="space-y-6">
  //       <Alert className="bg-amber-50 text-amber-800 border-amber-200">
  //         <AlertCircle className="h-4 w-4" />
  //         <AlertTitle>Authentication Required</AlertTitle>
  //         <AlertDescription>
  //           You need to login to view and manage categories.
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Categories</h2>
          <p className="text-muted-foreground">Organize your products with categories</p>
        </div>

        {isVerified && (
          <AddCategoryDialog 
            categories={categories} 
            onAddCategory={handleAddCategory} 
            isSubmitting={isSubmitting || isLoading} 
          />
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
              ? 'Your business verification is currently under review. You cannot add new categories until the review is complete. You can still view existing categories.'
              : verificationStatus === 'rejected'
              ? 'Your business verification was rejected. Please review the feedback and resubmit your verification documents. Only verified merchants can manage categories.'
              : verificationStatus === 'pending'
              ? 'Your business verification is pending review. You cannot add new categories until verification is approved. You can still view existing categories.'
              : 'Your business is not verified yet. Only verified merchants can manage categories.'
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
            placeholder="Search categories..."
            className="pl-8 w-full"
            value={localSearchValue}
            onChange={(e) => setLocalSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchQuery(localSearchValue)
              }
            }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-5">Category Name</div>
                <div className="col-span-3">Products</div>
                <div className="col-span-2">Parent</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              <div className="divide-y">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-12 p-3">
                    <div className="col-span-5 flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="col-span-2 flex items-center">
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg border">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm font-medium">Updating categories...</span>
                  </div>
                </div>
              )}
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Category Name</div>
                  <div className="col-span-3">Products</div>
                  <div className="col-span-2">Parent</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <CategoryListItem
                        key={category.id}
                        category={category}
                        onDelete={handleDeleteCategory}
                        onUpdate={handleUpdateCategory}
                        isSubmitting={isSubmitting || isLoading}
                        productCount={0} // In a real app, this would be a count from the API
                        categories={categories}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No categories found matching your search.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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

      <CategoryTips />
    </div>
  )
}