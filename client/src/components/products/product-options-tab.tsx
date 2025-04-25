"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface ProductOptionsTabProps {
  formData: {
    stock: string
    isVisible: boolean
    isFeatured: boolean
    hasVariants: boolean
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleSwitchChange: (name: string, checked: boolean) => void
}

export function ProductOptionsTab({ formData, handleInputChange, handleSwitchChange }: ProductOptionsTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stock</CardTitle>
          <CardDescription>Manage your product stock</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity*</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="hasVariants"
              checked={formData.hasVariants}
              onCheckedChange={(checked) => handleSwitchChange("hasVariants", checked)}
            />
            <Label htmlFor="hasVariants">This product has multiple variants</Label>
          </div>

          {formData.hasVariants && (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Variant Management</AlertTitle>
              <AlertDescription>
                You'll be able to add variants (like sizes, colors) after creating the product.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
          <CardDescription>Control how this product appears in your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isVisible"
              checked={formData.isVisible}
              onCheckedChange={(checked) => handleSwitchChange("isVisible", checked)}
            />
            <Label htmlFor="isVisible">Make this product visible public</Label>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
            />
            <Label htmlFor="isFeatured">Feature this product on your homepage</Label>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
