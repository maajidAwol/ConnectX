"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ProductDetailsTabProps {
  formData: {
    price: string
    profitPercentage: string
    costPrice: string
    weight: string
    dimensions: {
      length: string
      width: string
      height: string
    }
    taxable: boolean
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleDimensionChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSwitchChange: (name: string, checked: boolean) => void
}

export function ProductDetailsTab({
  formData,
  handleInputChange,
  handleDimensionChange,
  handleSwitchChange,
}: ProductDetailsTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Set your product pricing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (ETB)*</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profitPercentage">Profit Percentage (%)</Label>
              <Input
                id="profitPercentage"
                name="profitPercentage"
                type="number"
                step="0.01"
                min="0"
                value={formData.profitPercentage}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price (ETB)</Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div> */}
          </div>

          {/* <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="taxable"
              checked={formData.taxable}
              onCheckedChange={(checked) => handleSwitchChange("taxable", checked)}
            />
            <Label htmlFor="taxable">This product is taxable</Label>
          </div> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dimensions & Weight</CardTitle>
          <CardDescription>Product physical characteristics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length (cm)</Label>
              <Input
                id="length"
                name="length"
                type="number"
                step="0.1"
                min="0"
                value={formData.dimensions.length}
                onChange={handleDimensionChange}
                placeholder="0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (cm)</Label>
              <Input
                id="width"
                name="width"
                type="number"
                step="0.1"
                min="0"
                value={formData.dimensions.width}
                onChange={handleDimensionChange}
                placeholder="0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                min="0"
                value={formData.dimensions.height}
                onChange={handleDimensionChange}
                placeholder="0.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
