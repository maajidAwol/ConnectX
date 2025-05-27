"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

const COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Orange",
  "Brown",
  "Gray",
  "Silver",
  "Gold",
] as const

const SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
] as const

interface ProductOptionsTabProps {
  formData: {
    is_public: boolean
    colors: string[]
    sizes: string[]
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleArrayFieldChange: (field: string, value: string) => void
  handleSwitchChange: (name: string, checked: boolean) => void
}

export function ProductOptionsTab({ formData, handleInputChange, handleArrayFieldChange, handleSwitchChange }: ProductOptionsTabProps) {
  const [openColors, setOpenColors] = useState(false)
  const [sizeInput, setSizeInput] = useState("")

  const handleSizeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && sizeInput.trim()) {
      e.preventDefault()
      const newSize = sizeInput.trim()
      if (!formData.sizes.includes(newSize)) {
        handleArrayFieldChange('sizes', [...formData.sizes, newSize].join(', '))
      }
      setSizeInput("")
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>Add colors and sizes for your product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Colors</Label>
            <Popover open={openColors} onOpenChange={setOpenColors}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openColors}
                  className="w-full justify-between"
                >
                  {formData.colors.length > 0
                    ? `${formData.colors.length} colors selected`
                    : "Select colors..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Command>
                  <CommandInput placeholder="Search colors..." />
                  <CommandEmpty>No color found.</CommandEmpty>
                  <CommandGroup>
                    {COLORS.map((color) => (
                      <CommandItem
                        key={color}
                        onSelect={() => {
                          const newColors = formData.colors.includes(color)
                            ? formData.colors.filter((c) => c !== color)
                            : [...formData.colors, color]
                          handleArrayFieldChange('colors', newColors.join(', '))
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.colors.includes(color) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {color}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.colors.map((color) => (
                <Badge key={color} variant="secondary" className="flex items-center gap-1">
                  {color}
                  <button
                    onClick={() => {
                      const newColors = formData.colors.filter((c) => c !== color)
                      handleArrayFieldChange('colors', newColors.join(', '))
                    }}
                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sizes</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size) => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1">
                    {size}
                    <button
                      onClick={() => {
                        const newSizes = formData.sizes.filter((s) => s !== size)
                        handleArrayFieldChange('sizes', newSizes.join(', '))
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
                  placeholder="Add a size and press Enter"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={handleSizeInputKeyDown}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Common Sizes</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Command>
                      <CommandInput placeholder="Search sizes..." />
                      <CommandEmpty>No size found.</CommandEmpty>
                      <CommandGroup>
                        {SIZES.map((size) => (
                          <CommandItem
                            key={size}
                            onSelect={() => {
                              if (!formData.sizes.includes(size)) {
                                handleArrayFieldChange('sizes', [...formData.sizes, size].join(', '))
                              }
                            }}
                          >
                            {size}
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

      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
          <CardDescription>Control how this product appears in your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => handleSwitchChange("is_public", checked)}
            />
            <Label htmlFor="is_public">Make this product visible to public</Label>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
