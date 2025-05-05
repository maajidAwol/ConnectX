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
import { Plus, Upload } from "lucide-react"
import { toast } from "sonner"
import useCategoryStore from "@/store/useCategoryStore"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  parent: z.string().nullable(),
})

interface AddCategoryDialogProps {
  categories: any[]
  onAddCategory: (data: any) => Promise<void>
  isSubmitting: boolean
}

export function AddCategoryDialog({ categories, onAddCategory, isSubmitting }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      parent: null,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIconFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setIconPreview(previewUrl)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const categoryData = {
        name: values.name,
        description: values.description,
        icon: iconFile ? await convertFileToBase64(iconFile) : "icon-url", // Use uploaded icon or default
        parent: values.parent === "none" ? null : values.parent
      }

      await onAddCategory(categoryData)
      toast.success("Category added successfully", { className: 'bg-[#02569B] text-white' })
      setOpen(false)
      form.reset()
      setIconFile(null)
      setIconPreview(null)
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error("Failed to add category. Please try again.", { className: 'bg-red-500 text-white' })
    }
  }

  // Helper function to convert File to base64
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new product category. Fill in the details below.
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
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
                  {iconPreview && (
                    <div className="mt-2">
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Optional: Upload an icon for the category. If not provided, a default icon will be used.
              </FormDescription>
            </FormItem>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
