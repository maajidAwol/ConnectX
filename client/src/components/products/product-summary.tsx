"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Loader2 } from "lucide-react"

interface ProductSummaryProps {
  formData: {
    name: string
    price: string
    category: string
    stock: string
    isVisible: boolean
  }
  images: Array<{ file: File; preview: string; uploading?: boolean }>
  isSubmitting: boolean
}

export function ProductSummary({ formData, images, isSubmitting }: ProductSummaryProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Product Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <span className="text-sm font-medium">Status</span>
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full ${formData.isVisible ? "bg-green-500" : "bg-red-500"}`}></span>
            <span className="ml-2 text-sm">{formData.isVisible ? "Visible" : "Hidden"}</span>
          </div>
        </div>

        {formData.name && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Name</span>
            <p className="text-sm">{formData.name}</p>
          </div>
        )}

        {formData.price && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Price</span>
            <p className="text-sm">ETB {Number.parseFloat(formData.price).toLocaleString()}</p>
          </div>
        )}

        {formData.category && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Category</span>
            <p className="text-sm">{formData.category}</p>
          </div>
        )}

        {formData.stock && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Stock</span>
            <p className="text-sm">{formData.stock} units</p>
          </div>
        )}

        <div className="space-y-1">
          <span className="text-sm font-medium">Images</span>
          <p className="text-sm">{images.filter((img) => !img.uploading).length} uploaded</p>
        </div>

        <div className="border-t pt-4 mt-4">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last edited: Just now
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
