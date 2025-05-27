import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/store/useProductStore"

interface ListProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onList: (productId: string, profitPercentage: number) => Promise<void>
}

export function ListProductModal({ isOpen, onClose, product, onList }: ListProductModalProps) {
  const [profitPercentage, setProfitPercentage] = useState<string>("")
  const [sellingPrice, setSellingPrice] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeInput, setActiveInput] = useState<"percentage" | "price">("percentage")

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setProfitPercentage("")
      setSellingPrice("")
      setActiveInput("percentage")
    }
  }, [isOpen])

  // Calculate selling price when profit percentage changes
  useEffect(() => {
    if (!product?.base_price) return

    if (activeInput === "percentage" && profitPercentage) {
      const basePrice = parseFloat(product.base_price)
      const percentage = parseFloat(profitPercentage)
      if (!isNaN(basePrice) && !isNaN(percentage)) {
        const calculatedPrice = basePrice * (1 + percentage / 100)
        setSellingPrice(calculatedPrice.toFixed(2))
      }
    }
  }, [profitPercentage, product?.base_price, activeInput])

  // Calculate profit percentage when selling price changes
  useEffect(() => {
    if (!product?.base_price) return

    if (activeInput === "price" && sellingPrice) {
      const basePrice = parseFloat(product.base_price)
      const price = parseFloat(sellingPrice)
      if (!isNaN(basePrice) && !isNaN(price) && basePrice > 0) {
        const calculatedPercentage = ((price - basePrice) / basePrice) * 100
        setProfitPercentage(calculatedPercentage.toFixed(2))
      }
    }
  }, [sellingPrice, product?.base_price, activeInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profitPercentage || !product) return

    setIsLoading(true)
    try {
      await onList(product.id, parseFloat(profitPercentage))
      toast.success("Product listed successfully", { className: 'bg-[#02569B] text-white' })
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to list product", { className: 'bg-red-500 text-white' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>List Product</DialogTitle>
          <DialogDescription>
            Set your profit percentage or selling price for {product.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              value={`${product.base_price} ETB`}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profitPercentage">Profit Percentage (%)</Label>
            <Input
              id="profitPercentage"
              type="number"
              step="0.01"
              value={profitPercentage}
              onChange={(e) => {
                setActiveInput("percentage")
                setProfitPercentage(e.target.value)
              }}
              placeholder="Enter profit percentage"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellingPrice">Selling Price (ETB)</Label>
            <Input
              id="sellingPrice"
              type="number"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => {
                setActiveInput("price")
                setSellingPrice(e.target.value)
              }}
              placeholder="Enter selling price"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !profitPercentage}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Listing...
                </>
              ) : (
                "List Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 