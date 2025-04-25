"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { productCategories } from "@/lib/data"

interface ProductBasicInfoTabProps {
  formData: {
    name: string
    sku: string
    description: string
    shortDescription: string
    category: string
    tags: string
    brand: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  generateSKU: () => void
}

export function ProductBasicInfoTab({ formData, handleInputChange, generateSKU }: ProductBasicInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Enter the basic details of your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* <div className="space-y-2">
            <Label htmlFor="sku">SKU (Stock Keeping Unit)*</Label>
            <div className="flex gap-2">
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="SKU-0000"
                required
              />
              <Button type="button" onClick={generateSKU} className="bg-blue-600 hover:bg-blue-700">
                Generate
              </Button>
            </div>
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="category">Category*</Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) => {
                const e = { target: { name: "category", value } } as React.ChangeEvent<HTMLSelectElement>
                handleInputChange(e)
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description*</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your product in detail"
            rows={6}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="Brief summary to display in listings"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Enter brand name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g. electronics, headphones, wireless"
          />
        </div>
      </CardContent>
    </Card>
  )
}
