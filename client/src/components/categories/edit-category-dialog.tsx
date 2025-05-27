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
import { Pencil, Upload, X } from "lucide-react"
import { toast } from "sonner"
import type { Category } from "@/store/useCategoryStore"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  parent: z.string().optional(),
})

interface EditCategoryDialogProps {
  category: Category
  categories: Category[]
  onEditCategory: (id: string, data: {
    name: string
    description: string
    icon?: File
    parent?: string
  }) => Promise<void>
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
      parent: category.parent || undefined,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file", { className: 'bg-red-500 text-white' })
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB", { className: 'bg-red-500 text-white' })
        return
      }
      
      setIconFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setIconPreview(previewUrl)
    }
  }

  const handleRemoveFile = () => {
    setIconFile(null)
    if (iconPreview) {
      URL.revokeObjectURL(iconPreview)
      setIconPreview(null)
    }
    // Reset the file input
    const fileInput = document.getElementById('edit-icon-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updateData = {
        name: values.name,
        description: values.description,
        icon: iconFile || undefined,
        parent: values.parent || undefined
      }

      await onEditCategory(category.id, updateData)
      toast.success("Category updated successfully", { className: 'bg-[#02569B] text-white' })
      setOpen(false)
      form.reset()
      handleRemoveFile()
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category. Please try again.", { className: 'bg-red-500 text-white' })
    }
  }

  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Clean up when dialog closes
      form.reset({
        name: category.name,
        description: category.description,
        parent: category.parent || undefined,
      })
      handleRemoveFile()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to the category details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name <span className="text-red-500">*</span></FormLabel>
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
                  <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="resize-none"
                      rows={3}
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
                    onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level Category)</SelectItem>
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
                <div className="space-y-2">
                  {!iconFile ? (
                    <div className="space-y-2">
                      {category.icon && (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                          <img
                            src={category.icon}
                            alt="Current icon"
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 text-sm">
                            <p className="font-medium">Current Icon</p>
                            <p className="text-muted-foreground">Click below to change</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          id="edit-icon-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                        <img
                          src={iconPreview!}
                          alt="New icon preview"
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{iconFile.name}</p>
                          <p className="text-muted-foreground">
                            {(iconFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-icon-upload')?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Image
                      </Button>
                      <input
                        id="edit-icon-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Optional: Upload a new icon for the category (max 5MB). Supported formats: JPG, PNG, GIF, WebP
              </FormDescription>
            </FormItem>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleDialogClose(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
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