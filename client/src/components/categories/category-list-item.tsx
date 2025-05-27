"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Folder } from "lucide-react"
import { Category } from "@/store/useCategoryStore"
import { EditCategoryDialog } from "./edit-category-dialog"

interface CategoryListItemProps {
  category: Category
  onDelete: (id: string) => void
  onUpdate: (id: string, data: {
    name: string
    description: string
    icon?: File
    parent?: string
  }) => Promise<void>
  isSubmitting: boolean
  productCount?: number
  categories: Category[]
}

export function CategoryListItem({ 
  category, 
  onDelete, 
  onUpdate, 
  isSubmitting, 
  productCount = 0,
  categories 
}: CategoryListItemProps) {
  return (
    <div className="grid grid-cols-12 items-center p-3">
      <div className="col-span-5 flex items-center gap-2">
        {category.icon ? (
          <img
            src={category.icon}
            alt={category.name}
            className="w-8 h-8 object-cover rounded"
          />
        ) : (
          <Folder className="h-4 w-4 text-blue-600" />
        )}
        <div>
          <span className="font-medium">{category.name}</span>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            {category.description}
          </p>
        </div>
      </div>
      <div className="col-span-3">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {productCount} Products
        </Badge>
      </div>
      <div className="col-span-2 text-sm text-muted-foreground">
        {category.parent ? (
          categories.find(c => c.id === category.parent)?.name || "Unknown"
        ) : (
          "Top Level"
        )}
      </div>
      <div className="col-span-2 flex justify-end gap-2">
        <EditCategoryDialog
          category={category}
          categories={categories}
          onEditCategory={onUpdate}
          isSubmitting={isSubmitting}
        />
        <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)}>
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}
