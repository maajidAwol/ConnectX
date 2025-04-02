"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import productData from '@/data/product-data.json'
import {
  BarChart3,
  Box,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Image as ImageIcon,
  Upload,
  X,
  Info,
  Calendar,
  Tag as TagIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

const navigation = [
  {
    title: "Dashboard",
    href: "/merchant/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/merchant/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/merchant/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/merchant/customers",
    icon: Users,
  },
  {
    title: "Stock",
    href: "/merchant/stock",
    icon: Box,
  },
  {
    title: "Analytics",
    href: "/merchant/analytics",
    icon: BarChart3,
  },
  {
    title: "Marketing",
    href: "/merchant/marketing",
    icon: Tag,
  },
  {
    title: "Account",
    href: "/merchant/account",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/merchant/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/merchant/help",
    icon: HelpCircle,
  },
]

interface ProductImage {
  url: string
  alt: string
}

interface Promotion {
  type: string
  value: number
  startDate: string
  endDate: string
}

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  comparePrice: number
  stock: number
  visibility: string
  status: string
  images: ProductImage[]
  features: string[]
  promotions: Promotion[]
  createdAt: string
  updatedAt: string
  source: string
  requiredPlan: string
}

interface FormData {
  name: string
  description: string
  category: string
  price: string
  comparePrice: string
  stock: string
  visibility: string
  status: string
  imageUrl?: string
}

interface Subscription {
  currentPlan: string
  planLimits: {
    [key: string]: {
      maxCustomProducts: number | "unlimited"
      maxCustomCategories: number | "unlimited"
      features: string[]
    }
  }
}

interface Statistics {
  totalProducts: number
  publicProducts: number
  privateProducts: number
  lowStock: number
  activePromotions: number
  centralProducts: number
  customProducts: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(productData.products)
  const [categories] = useState(productData.categories)
  const [statistics, setStatistics] = useState<Statistics>(productData.statistics)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isEditingProduct, setIsEditingProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    price: "",
    comparePrice: "",
    stock: "",
    visibility: "public",
    status: "active",
  })
  const [subscription, setSubscription] = useState<Subscription>(productData.subscription)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [productSource, setProductSource] = useState<"all" | "central" | "custom">("all")

  const handleVisibilityToggle = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, visibility: product.visibility === "public" ? "private" : "public" }
        : product
    ))
    updateStatistics()
  }

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.id !== productId))
      updateStatistics()
    }
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      stock: product.stock.toString(),
      visibility: product.visibility,
      status: product.status,
    })
    setIsEditingProduct(true)
  }

  const canAddCustomProducts = () => {
    const currentPlan = subscription.currentPlan
    const limits = subscription.planLimits[currentPlan]
    if (limits.maxCustomProducts === "unlimited") return true
    
    const currentCustomProducts = products.filter(p => p.source === "custom").length
    return currentCustomProducts < limits.maxCustomProducts
  }

  const handleAddProduct = () => {
    if (!canAddCustomProducts()) {
      setShowUpgradeDialog(true)
      return
    }
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      comparePrice: "",
      stock: "",
      visibility: "public",
      status: "active",
    })
    setIsAddingProduct(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'connectx_products')
      formData.append('cloud_name', 'your_cloud_name')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setUploadedImage(data.secure_url)
      setFormData(prev => ({
        ...prev,
        imageUrl: data.secure_url
      }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newProduct: Product = {
      id: isEditingProduct ? selectedProduct!.id : products.length + 1,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : 0,
      stock: parseInt(formData.stock),
      visibility: formData.visibility,
      status: formData.status,
      source: isEditingProduct ? selectedProduct!.source : "custom",
      requiredPlan: subscription.currentPlan,
      images: [{
        url: uploadedImage || "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=500&fit=crop",
        alt: formData.name
      }],
      features: isEditingProduct ? selectedProduct!.features : [],
      promotions: isEditingProduct ? selectedProduct!.promotions : [],
      createdAt: isEditingProduct ? selectedProduct!.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isEditingProduct) {
      setProducts(products.map(p => p.id === newProduct.id ? newProduct : p))
    } else {
      setProducts([...products, newProduct])
    }

    setIsAddingProduct(false)
    setIsEditingProduct(false)
    setSelectedProduct(null)
    setUploadedImage(null)
    updateStatistics()
  }

  const updateStatistics = () => {
    setStatistics({
      totalProducts: products.length,
      publicProducts: products.filter(p => p.visibility === "public").length,
      privateProducts: products.filter(p => p.visibility === "private").length,
      lowStock: products.filter(p => p.stock < 100).length,
      activePromotions: products.filter(p => p.promotions.length > 0).length,
      centralProducts: products.filter(p => p.source === "central").length,
      customProducts: products.filter(p => p.source === "custom").length,
    })
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesVisibility = visibilityFilter === "all" || product.visibility === visibilityFilter
    const matchesSource = productSource === "all" || product.source === productSource
    return matchesSearch && matchesCategory && matchesVisibility && matchesSource
  })

  return (
    <DashboardLayout navigation={navigation} role="merchant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Subscription Alert */}
        {subscription.currentPlan === "free" && (
          <Alert>
            <AlertTitle>Free Plan Active</AlertTitle>
            <AlertDescription>
              You are currently on the free plan. Upgrade to add your own custom products and categories.
            </AlertDescription>
          </Alert>
        )}

        {/* Product Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="mt-2 text-3xl font-semibold">{statistics.totalProducts}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Central Products</h3>
            <p className="mt-2 text-3xl font-semibold">{statistics.centralProducts}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Custom Products</h3>
            <p className="mt-2 text-3xl font-semibold">{statistics.customProducts}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Promotions</h3>
            <p className="mt-2 text-3xl font-semibold">{statistics.activePromotions}</p>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <select
            className="rounded-md border border-gray-200 p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-gray-200 p-2"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
          >
            <option value="all">All Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <select
            className="rounded-md border border-gray-200 p-2"
            value={productSource}
            onChange={(e) => setProductSource(e.target.value as "all" | "central" | "custom")}
          >
            <option value="all">All Products</option>
            <option value="central">Central Products</option>
            <option value="custom">Custom Products</option>
          </select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedProduct(product)}>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">${product.price}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.comparePrice}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock < 100 ? "destructive" : "secondary"}>
                        {product.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVisibilityToggle(product.id)
                        }}
                      >
                        {product.visibility === "public" ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditProduct(product)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProduct(product.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Product Form Modal */}
        {(isAddingProduct || isEditingProduct) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{isEditingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                  <CardDescription>Fill in the details for your product</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsAddingProduct(false)
                    setIsEditingProduct(false)
                    setSelectedProduct(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Enter price"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comparePrice">Compare Price</Label>
                      <Input
                        id="comparePrice"
                        type="number"
                        value={formData.comparePrice}
                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                        placeholder="Enter compare price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="Enter stock quantity"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <select
                        id="visibility"
                        value={formData.visibility}
                        onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2"
                        required
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-md border border-gray-200 p-2"
                      rows={4}
                      placeholder="Enter product description"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <div className="flex items-center space-x-4">
                      <div 
                        className="h-32 w-32 rounded-md border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadedImage ? (
                          <img
                            src={uploadedImage}
                            alt="Uploaded product"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-500 mt-1">Click to upload</span>
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <div className="flex flex-col space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                        <p className="text-xs text-gray-500">
                          Recommended: 500x500px, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingProduct(false)
                        setIsEditingProduct(false)
                        setSelectedProduct(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && !isEditingProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Details</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProduct(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-48 h-48 rounded-lg overflow-hidden">
                      <img
                        src={selectedProduct.images[0].url}
                        alt={selectedProduct.images[0].alt}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-semibold">{selectedProduct.name}</h3>
                        <p className="text-gray-500">{selectedProduct.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={selectedProduct.visibility === "public" ? "default" : "secondary"}>
                          {selectedProduct.visibility}
                        </Badge>
                        <Badge variant={selectedProduct.status === "active" ? "default" : "secondary"}>
                          {selectedProduct.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-sm text-gray-500">Price</span>
                          <p className="text-2xl font-semibold">${selectedProduct.price}</p>
                          {selectedProduct.comparePrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ${selectedProduct.comparePrice}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Stock</span>
                          <p className="text-2xl font-semibold">{selectedProduct.stock} units</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">Features</h4>
                      <ul className="space-y-2">
                        {selectedProduct.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Promotions</h4>
                      {selectedProduct.promotions.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedProduct.promotions.map((promo: any, index: number) => (
                            <li key={index} className="flex items-center space-x-2">
                              <TagIcon className="h-4 w-4 text-blue-500" />
                              <span>{promo.value}% off until {new Date(promo.endDate).toLocaleDateString()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No active promotions</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(null)
                        handleEditProduct(selectedProduct)
                      }}
                    >
                      Edit Product
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this product?")) {
                          handleDeleteProduct(selectedProduct.id)
                          setSelectedProduct(null)
                        }
                      }}
                    >
                      Delete Product
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upgrade Plan Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade Your Plan</DialogTitle>
              <DialogDescription>
                Upgrade your plan to add custom products and categories to your ecommerce platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {Object.entries(subscription.planLimits).map(([plan, limits]) => (
                <div
                  key={plan}
                  className={`p-4 rounded-lg border ${
                    subscription.currentPlan === plan
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold capitalize">{plan} Plan</h3>
                    {subscription.currentPlan === plan && (
                      <Badge>Current Plan</Badge>
                    )}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {limits.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      variant={subscription.currentPlan === plan ? "outline" : "default"}
                      onClick={() => {
                        setSubscription(prev => ({
                          ...prev,
                          currentPlan: plan
                        }))
                        setShowUpgradeDialog(false)
                      }}
                    >
                      {subscription.currentPlan === plan ? "Current Plan" : "Upgrade"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

