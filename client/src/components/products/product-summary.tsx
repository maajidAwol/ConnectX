"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CardDescription } from "@/components/ui/card"

interface ProductSummaryProps {
  formData: {
    name: string
    sku: string
    base_price: string
    quantity: string
    category_id: string
    description: string
    short_description: string
    tag: string[]
    brand: string
    additional_info: Record<string, string>
    warranty: string
    is_public: boolean
    colors: string[]
    sizes: string[]
  }
  images: Array<{ file: File; preview: string; uploading?: boolean }>
  isSubmitting: boolean
  errors: {
    name?: string
    sku?: string
    category_id?: string
    description?: string
    base_price?: string
    quantity?: string
    cover_url?: string
  }
  onSubmit: () => void
}

export function ProductSummary({ formData, images, isSubmitting, errors, onSubmit }: ProductSummaryProps) {
  const hasErrors = Object.keys(errors).length > 0
  
  // Group errors by tab for better display
  const errorsByTab = {
    basic: Boolean(errors.name || errors.sku || errors.category_id || errors.description),
    details: Boolean(errors.base_price || errors.quantity),
    images: Boolean(errors.cover_url)
  }

  // Mock categories for UI display (replace with actual integration later)
  const mockCategories = [
    { id: "1", name: "Electronics" },
    { id: "2", name: "Clothing" },
    { id: "3", name: "Home & Kitchen" },
    { id: "4", name: "Accessories" }
  ]

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Product Summary</CardTitle>
        <CardDescription>Review your product details before submitting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <Badge variant={formData.is_public ? "default" : "secondary"}>
              {formData.is_public ? "Public" : "Private"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <Label>Category</Label>
            <span className="text-sm text-muted-foreground">
              {mockCategories.find(c => String(c.id) === formData.category_id)?.name || "Not selected"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Price</Label>
            <span className="text-sm text-muted-foreground">
              {formData.base_price ? `ETB ${formData.base_price}` : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Stock</Label>
            <span className="text-sm text-muted-foreground">
              {formData.quantity || "Not set"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Images</Label>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                <img
                  src={image.preview}
                  alt={`Product ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          className="w-full"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
        
        {hasErrors && (
          <div className="bg-red-50 border border-red-300 rounded-md p-3 mt-3">
            <p className="text-sm text-red-600 font-medium mb-2">
              Please fix the following errors:
            </p>
            <ul className="text-xs text-red-600 space-y-1 pl-2">
              {errorsByTab.basic && (
                <li>• Missing fields in Basic Info tab</li>
              )}
              {errorsByTab.details && (
                <li>• Missing fields in Details tab</li>
              )}
              {errorsByTab.images && (
                <li>• Missing cover image in Images tab</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button type="button" variant="outline" className="w-full" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
