"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Loader2, Tag, Ruler, InfoIcon, Box, Globe, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import useProductStore from "@/store/useProductStore"
import { useAuthStore } from "@/store/authStore"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function ProductDetails() {
  const router = useRouter()
  const { id } = useParams()
  const productId = id as string
  
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeImage, setActiveImage] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  
  const { getProductById } = useProductStore()
  const { user } = useAuthStore()
  
  const isProductOwner = product && user?.tenant === product.owner
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true)
        const data = await getProductById(productId)
        setProduct(data)
        
        // Set first image as active image
        if (data.cover_url) {
          setActiveImage(data.cover_url)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product details. Please try again.")
        toast.error("Failed to load product details")
      } finally {
        setIsLoading(false)
      }
    }
    
    if (productId) {
      fetchProductDetails()
    }
  }, [productId, getProductById])
  
  // Function to format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  
  // If loading
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    )
  }
  
  // If error
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Details</h1>
          <Button variant="outline" onClick={() => router.back()} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }
  
  // If no product
  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Details</h1>
          <Button variant="outline" onClick={() => router.back()} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Product not found</AlertDescription>
        </Alert>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="outline" onClick={() => router.back()} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {product.is_public ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Public
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Private
              </Badge>
            )}
            <Badge variant="outline" className="bg-gray-100">SKU: {product.sku}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground mt-1">{product.short_description}</p>
        </div>
        
        {isProductOwner && (
          <Link href={`/merchant/products/add?id=${product.id}`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              <span>Edit Product</span>
            </Button>
          </Link>
        )}
      </div>
      
      {/* Product content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image gallery - first column on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative w-full aspect-square">
                <Image 
                  src={activeImage || product.cover_url || "/placeholder.svg"} 
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Thumbnails */}
          <div className="flex flex-wrap gap-2">
            {product.cover_url && (
              <div 
                className={`w-20 h-20 border rounded overflow-hidden ${activeImage === product.cover_url ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveImage(product.cover_url)}
              >
                <Image
                  src={product.cover_url}
                  alt="Cover"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            )}
            {product.images && product.images.map((image: string, index: number) => (
              <div 
                key={index}
                className={`w-20 h-20 border rounded overflow-hidden ${activeImage === image ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveImage(image)}
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product details - second column on large screens */}
        <div className="space-y-6">
          {/* Price and stock info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Base Price:</span>
                <span className="text-xl font-semibold">{product.base_price} ETB</span>
              </div>
              
              {product.selling_price && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Selling Price:</span>
                  <span className="text-xl font-semibold">{product.selling_price} ETB</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantity Available:</span>
                <span className="font-medium">{product.quantity}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Sold:</span>
                <span className="font-medium">{product.total_sold || 0}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Product specifications */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category?.name || "Uncategorized"}</p>
                </div>
              </div>
              
              {product.brand && (
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                </div>
              )}
              
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Colors</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.colors.map((color: string, index: number) => (
                        <Badge key={index} variant="outline">{color}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex items-start gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Sizes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.sizes.map((size: string, index: number) => (
                        <Badge key={index} variant="outline">{size}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {product.warranty && (
                <div className="flex items-start gap-3">
                  <InfoIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Warranty</p>
                    <p className="font-medium">{product.warranty}</p>
                  </div>
                </div>
              )}
              
              {product.tag && product.tag.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.tag.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {Object.keys(product.additional_info || {}).length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium">Additional Information</p>
                    {Object.entries(product.additional_info).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-muted-foreground">{key}</span>
                        <span className="text-sm">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Meta information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <p className="font-medium">{product.is_public ? "Public" : "Private"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(product.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(product.updated_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Ratings</p>
                  <p className="font-medium">{product.total_ratings || 0} ratings, {product.total_reviews || 0} reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Description section */}
      <div className="mt-8">
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            {/* Add more tabs if needed */}
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  {product.description ? (
                    <div className="whitespace-pre-wrap">{product.description}</div>
                  ) : (
                    <p className="text-muted-foreground">No description available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 