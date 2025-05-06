"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProductDetailsTabProps {
  formData: {
    base_price: string
    quantity: string
    additional_info: Record<string, string>
    warranty: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleAdditionalInfoChange: (key: string, value: string) => void
  handleSwitchChange: (name: string, checked: boolean) => void
  errors: {
    base_price?: string
    quantity?: string
  }
}

export function ProductDetailsTab({
  formData,
  handleInputChange,
  handleAdditionalInfoChange,
  handleSwitchChange,
  errors,
}: ProductDetailsTabProps) {
  const [newInfoKey, setNewInfoKey] = useState("")
  const [newInfoValue, setNewInfoValue] = useState("")

  const handleAddInfo = () => {
    if (newInfoKey.trim() && newInfoValue.trim()) {
      handleAdditionalInfoChange(newInfoKey.trim(), newInfoValue.trim())
      setNewInfoKey("")
      setNewInfoValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddInfo()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>Enter pricing and additional information about your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="base_price">Base Price*</Label>
            <Input
              id="base_price"
              name="base_price"
              type="number"
              value={formData.base_price}
              onChange={handleInputChange}
              placeholder="0.00"
              required
              data-error={!!errors.base_price}
              className={errors.base_price ? "border-red-500" : ""}
            />
            {errors.base_price && (
              <p className="text-sm text-red-500">{errors.base_price}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity*</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="0"
              required
              data-error={!!errors.quantity}
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="warranty">Warranty</Label>
          <Input
            id="warranty"
            name="warranty"
            value={formData.warranty}
            onChange={handleInputChange}
            placeholder="e.g., 1 year manufacturer warranty"
          />
        </div>

        <div className="space-y-4">
          <Label>Additional Information</Label>
          <div className="space-y-2">
            {Object.entries(formData.additional_info).map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Field Name</Label>
                  <div className="flex gap-2">
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value
                        if (newKey !== key) {
                          handleAdditionalInfoChange(key, "")
                          handleAdditionalInfoChange(newKey, value)
                        }
                      }}
                      placeholder="Field name"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAdditionalInfoChange(key, "")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Field Value</Label>
                  <Input
                    value={value}
                    onChange={(e) => handleAdditionalInfoChange(key, e.target.value)}
                    placeholder="Field value"
                  />
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>New Field Name</Label>
                <Input
                  value={newInfoKey}
                  onChange={(e) => setNewInfoKey(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="e.g., Battery Life"
                />
              </div>
              <div className="space-y-2">
                <Label>New Field Value</Label>
                <div className="flex gap-2">
                  <Input
                    value={newInfoValue}
                    onChange={(e) => setNewInfoValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="e.g., 24 hours"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddInfo}
                    disabled={!newInfoKey.trim() || !newInfoValue.trim()}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
