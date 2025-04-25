"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { productCategories } from "@/lib/data"
import { CategoryListItem } from "@/components/categories/category-list-item"
import { CategoryTips } from "@/components/categories/category-tips"
import { AddCategoryDialog } from "@/components/categories/add-category-dialog"

export default function ProductCategories() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState(productCategories)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Add a new category
  const handleAddCategory = (name: string, description: string, parent: string) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newId = Math.max(...categories.map((c) => c.id)) + 1
      setCategories([...categories, { id: newId, name, count: 0 }])
      setIsSubmitting(false)
    }, 1000)
  }

  // Update an existing category
  const handleUpdateCategory = (id: number, name: string) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setCategories(categories.map((category) => (category.id === id ? { ...category, name } : category)))
      setIsSubmitting(false)
    }, 1000)
  }

  // Delete a category
  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Categories</h2>
          <p className="text-muted-foreground">Organize your products with categories</p>
        </div>

        <AddCategoryDialog categories={categories} onAddCategory={handleAddCategory} isSubmitting={isSubmitting} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
              <div className="col-span-5">Category Name</div>
              <div className="col-span-3">Products</div>
              <div className="col-span-2">Parent</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <CategoryListItem
                    key={category.id}
                    category={category}
                    onDelete={handleDeleteCategory}
                    onUpdate={handleUpdateCategory}
                    isSubmitting={isSubmitting}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">No categories found matching your search.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <CategoryTips />
    </div>
  )
}
