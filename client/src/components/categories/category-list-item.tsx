"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Folder } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Category } from "@/store/useCategoryStore"

interface CategoryListItemProps {
  category: Category
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Omit<Category, 'id'>>) => void
  isSubmitting: boolean
  productCount?: number
}

export function CategoryListItem({ category, onDelete, onUpdate, isSubmitting, productCount = 0 }: CategoryListItemProps) {
  const [editedCategory, setEditedCategory] = useState({
    name: category.name,
    description: category.description || "",
  })

  const handleUpdate = () => {
    onUpdate(category.id, {
      name: editedCategory.name,
      description: editedCategory.description
    })
  }

  return (
    <div className="grid grid-cols-12 items-center p-3">
      <div className="col-span-5 flex items-center gap-2">
        <Folder className="h-4 w-4 text-blue-600" />
        <span className="font-medium">{category.name}</span>
      </div>
      <div className="col-span-3">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {productCount} Products
        </Badge>
      </div>
      <div className="col-span-2 text-sm text-muted-foreground">
        {/* In a real app, you would show the parent category name here */}
        Top Level
      </div>
      <div className="col-span-2 flex justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update this product category.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  defaultValue={category.name}
                  onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  defaultValue={editedCategory.description}
                  onChange={(e) => setEditedCategory({ ...editedCategory, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parent">Parent Category</Label>
                <select
                  id="edit-parent"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  defaultValue=""
                >
                  <option value="">None (Top Level)</option>
                  {/* Parent categories would be mapped here in a real app */}
                </select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleUpdate}
                disabled={!editedCategory.name || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)}>
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}
