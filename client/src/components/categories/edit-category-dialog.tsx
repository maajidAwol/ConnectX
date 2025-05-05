"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Upload } from "lucide-react"
import { toast } from "sonner"
import type { Category } from "@/store/useCategoryStore"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }).optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).optional(),
  parent: z.string().nullable().optional(),
})

interface EditCategoryDialogProps {
  category: Category
  categories: Category[]
  onEditCategory: (id: string, data: Partial<Category>) => Promise<void>
  isSubmitting: boolean
}

export function EditCategoryDialog({ 
  category, 
  categories, 
  onEditCategory,
  isSubmitting 
}: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description,
      parent: category.parent,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIconFile(file)
      const previewUrl = URL.createObjectURL(file)
      setIconPreview(previewUrl)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updateData: Partial<Category> = {}
      
      // Only include changed fields
      if (values.name !== category.name) updateData.name = values.name
      if (values.description !== category.description) updateData.description = values.description
      if (values.parent !== category.parent) {
        updateData.parent = values.parent === "none" ? null : values.parent
      }
      if (iconFile) {
        updateData.icon = await convertFileToBase64(iconFile)
      }

      await onEditCategory(category.id, updateData)
      toast.success("Category updated successfully", { className: 'bg-[#02569B] text-white' })
      setOpen(false)
      form.reset()
      setIconFile(null)
      setIconPreview(null)
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category. Please try again.", { className: 'bg-red-500 text-white' })
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to the category. Only modified fields will be updated.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories
                        .filter(c => c.id !== category.id) // Prevent self-selection
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional: Select a parent category if this is a subcategory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Category Icon</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {(iconPreview || category.icon) && (
                    <div className="mt-2">
                      <img
                        src={iconPreview || category.icon || ''}
                        alt="Icon preview"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Optional: Upload a new icon for the category
              </FormDescription>
            </FormItem>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 