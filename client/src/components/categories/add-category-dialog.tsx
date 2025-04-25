"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus } from "lucide-react"
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
import { useState } from "react"

interface AddCategoryDialogProps {
  categories: Array<{ id: number; name: string; count: number }>
  onAddCategory: (name: string, description: string, parent: string) => void
  isSubmitting: boolean
}

export function AddCategoryDialog({ categories, onAddCategory, isSubmitting }: AddCategoryDialogProps) {
  const [newCategory, setNewCategory] = useState({ name: "", description: "", parent: "" })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>Create a new product category to organize your products.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="e.g. Electronics, Clothing"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Describe this category"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent">Parent Category (Optional)</Label>
            <select
              id="parent"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={newCategory.parent}
              onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value })}
            >
              <option value="">None (Top Level)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => onAddCategory(newCategory.name, newCategory.description, newCategory.parent)}
            disabled={!newCategory.name || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
