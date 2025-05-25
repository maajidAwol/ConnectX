"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/store/useCategoryStore"

interface ProductBasicInfoTabProps {
  formData: {
    name: string
    description: string
    short_description: string
    category_id: string
    tag: string[]
    brand: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleArrayFieldChange: (field: string, value: string) => void
  errors: {
    name?: string
    category_id?: string
    description?: string
  }
  categories: Category[]
  isCategoriesLoading: boolean
}

const COMMON_TAGS = [
  "electronics",
  "clothing",
  "accessories",
  "home",
  "beauty",
  "sports",
  "toys",
  "books",
  "food",
  "health",
  "fashion",
  "jewelry",
  "furniture",
  "automotive",
  "garden",
  "pet",
  "office",
  "art",
  "music",
  "travel",
] as const

export function ProductBasicInfoTab({ 
  formData, 
  handleInputChange, 
  handleArrayFieldChange, 
  errors,
  categories,
  isCategoriesLoading 
}: ProductBasicInfoTabProps) {
  const [openTags, setOpenTags] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!formData.tag.includes(newTag)) {
        handleArrayFieldChange('tag', [...formData.tag, newTag].join(', '))
      }
      setTagInput("")
    }
  }

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
            data-error={!!errors.name}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id">Category*</Label>
          <Select
            name="category_id"
            value={formData.category_id}
            onValueChange={(value) => {
              const e = { target: { name: "category_id", value } } as React.ChangeEvent<HTMLSelectElement>
              handleInputChange(e)
            }}
            required
            disabled={isCategoriesLoading}
          >
            <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
              <SelectValue placeholder={isCategoriesLoading ? "Loading categories..." : "Select category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-sm text-red-500">{errors.category_id}</p>
          )}
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
            data-error={!!errors.description}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_description">Short Description</Label>
          <Textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
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
          <Label>Tags</Label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {formData.tag.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => {
                      const newTags = formData.tag.filter((t) => t !== tag)
                      handleArrayFieldChange('tag', newTags.join(', '))
                    }}
                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />
              <Popover open={openTags} onOpenChange={setOpenTags}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={openTags}>
                    Common Tags
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search tags..." />
                    <CommandEmpty>No tag found.</CommandEmpty>
                    <CommandGroup>
                      {COMMON_TAGS.map((tag) => (
                        <CommandItem
                          key={tag}
                          onSelect={() => {
                            if (!formData.tag.includes(tag)) {
                              handleArrayFieldChange('tag', [...formData.tag, tag].join(', '))
                            }
                            setOpenTags(false)
                          }}
                        >
                          {tag}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
