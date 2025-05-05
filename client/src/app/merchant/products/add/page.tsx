"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, type File } from "lucide-react"
import { ProductBasicInfoTab } from "@/components/products/product-basic-info-tab"
import { ProductDetailsTab } from "@/components/products/product-details-tab"
import { ProductImagesTab } from "@/components/products/product-images-tab"
import { ProductOptionsTab } from "@/components/products/product-options-tab"
import { ProductSummary } from "@/components/products/product-summary"
import { FormSuccessAlert } from "@/components/products/form-success-alert"

export default function AddProduct() {
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [images, setImages] = useState<Array<{ file: File; preview: string; uploading?: boolean }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null!)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    profitPercentage: "",
    costPrice: "",
    description: "",
    shortDescription: "",
    category: "",
    tags: "",
    brand: "",
    stock: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    isVisible: true,
    isFeatured: false,
    hasVariants: false,
    taxable: true,
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle dimension changes
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }))
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Handle file selection
  const handleFileSelect = (files: FileList) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
      }))

      setImages((prevImages) => [...prevImages, ...newImages])

      // Simulate upload completion after a delay
      setTimeout(() => {
        setImages((prevImages) =>
          prevImages.map((img) => ({
            ...img,
            uploading: false,
          })),
        )
      }, 1500)
    }

    // Clear the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages]
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(updatedImages[index].preview)
      updatedImages.splice(index, 1)
      return updatedImages
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccessMessage("Product successfully added!")
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
    }, 2000)
  }

  // Generate a random SKU
  const generateSKU = () => {
    const prefix = "SKU"
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    const sku = `${prefix}-${randomNum}`

    setFormData((prev) => ({
      ...prev,
      sku,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/merchant/products" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
      </div>

      <FormSuccessAlert message={successMessage} visible={!!successMessage} />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-6">
          <div className="md:col-span-4 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="details">Details & Pricing</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="options">Options & Stock</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <ProductBasicInfoTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                  generateSKU={generateSKU}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <ProductDetailsTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleDimensionChange={handleDimensionChange}
                  handleSwitchChange={handleSwitchChange}
                />
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <ProductImagesTab
                  images={images}
                  onAddImage={handleFileSelect}
                  onRemoveImage={removeImage}
                  fileInputRef={fileInputRef}
                />
              </TabsContent>

              <TabsContent value="options" className="space-y-4">
                <ProductOptionsTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSwitchChange={handleSwitchChange}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-2 space-y-6">
            <ProductSummary formData={formData} images={images} isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
    </div>
  )
}
