import React, { useEffect, useState } from 'react'
import useCategoryStore from '@/store/useCategoryStore'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, FolderIcon } from 'lucide-react'
import type { Category } from '@/store/useCategoryStore'

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  isSubmitting: boolean
}

export function CategoryList({ 
  categories, 
  onEdit, 
  onDelete,
  isSubmitting 
}: CategoryListProps) {
  const { canEditCategory } = useCategoryStore()

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            {category.icon ? (
              <img
                src={category.icon}
                alt={category.name}
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                <FolderIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
              {category.parent && (
                <p className="text-xs text-gray-400">
                  Parent: {categories.find(c => c.id === category.parent)?.name || 'Unknown'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {canEditCategory(category) && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(category)}
                  disabled={isSubmitting}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 