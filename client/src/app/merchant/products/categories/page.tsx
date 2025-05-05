"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { CategoryListItem } from "@/components/categories/category-list-item"
import { CategoryTips } from "@/components/categories/category-tips"
import { AddCategoryDialog } from "@/components/categories/add-category-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import useCategoryStore from "@/store/useCategoryStore"
import { useAuthStore } from "@/store/authStore"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

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
  
  const { isAuthenticated, user, isTenantVerified } = useAuthStore()
  const isVerified = isTenantVerified()
  const [isSubmitting, setIsSubmitting] = useState(false)

  console.log(isVerified)

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Add a new category
  const handleAddCategory = async (data: {
    name: string
    description: string
    icon?: string
    parent?: string | null
  }) => {
    setIsSubmitting(true)
    try {
      await addCategory(data)
      await fetchCategories() // Refresh the list
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update an existing category
  const handleUpdateCategory = async (id: string, data: Partial<any>) => {
    setIsSubmitting(true)
    try {
      await updateCategory(id, data)
      await fetchCategories() // Refresh the list
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete a category
  const handleDeleteCategory = async (id: string) => {
    setIsSubmitting(true)
    try {
      await deleteCategory(id)
      await fetchCategories() // Refresh the list
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
            isSubmitting={isSubmitting} 
          />
        )}
      </div>

      {!isVerified && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            Your business is not verified yet. Only verified merchants can manage categories.
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
            value={searchQuery}
            onChange={handleSearchChange}
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
            <div className="p-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : (
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
                      isSubmitting={isSubmitting}
                      productCount={0} // In a real app, this would be a count from the API
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No categories found matching your search.</div>
                )}
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
