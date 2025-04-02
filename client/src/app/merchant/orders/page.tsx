"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Download, Mail, Package, RefreshCw, Truck, XCircle, CheckCircle2, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import merchantData from '@/data/merchant-data.json'
import {
  BarChart3,
  Box,
  HelpCircle,
  LayoutDashboard,
  Package as PackageIcon,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react"

const navigation = [
  {
    title: "Dashboard",
    href: "/merchant/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/merchant/products",
    icon: PackageIcon,
  },
  {
    title: "Orders",
    href: "/merchant/orders",
    icon: ShoppingCart,
    badge: 8,
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

export default function OrdersPage() {
  const { orders, returns, emailTemplates } = merchantData
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [selectedReturn, setSelectedReturn] = useState<any>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showReturnDetails, setShowReturnDetails] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [orderStatus, setOrderStatus] = useState<string>("all")
  const [returnStatus, setReturnStatus] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating order ${orderId} to status ${newStatus}`)
  }

  const handleReturnStatusUpdate = (returnId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating return ${returnId} to status ${newStatus}`)
  }

  const handleSendEmail = (template: any, order: any) => {
    // In a real app, this would make an API call
    console.log(`Sending email using template ${template.id} to order ${order.id}`)
    setShowEmailDialog(false)
  }

  return (
    <DashboardLayout navigation={navigation} role="merchant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Orders & Returns</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="mt-2 text-3xl font-semibold">
              {orders.statistics.totalOrders}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
            <p className="mt-2 text-3xl font-semibold">
              {orders.statistics.pendingOrders}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="mt-2 text-3xl font-semibold">
              ${orders.statistics.totalRevenue.toFixed(2)}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Return Rate</h3>
            <p className="mt-2 text-3xl font-semibold">
              {orders.statistics.returnRate}%
            </p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8"
                />
              </div>
              <select
                className="rounded-md border border-gray-200 p-2"
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.recent.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {order.items.map((item: any) => (
                              <img
                                key={item.id}
                                src={item.image}
                                alt={item.name}
                                className="h-8 w-8 rounded-md object-cover"
                              />
                            ))}
                            <span>{order.items.length} items</span>
                          </div>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowOrderDetails(true)
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order)
                                setSelectedTemplate(emailTemplates.list[0])
                                setShowEmailDialog(true)
                              }}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Returns Tab */}
          <TabsContent value="returns" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search returns..."
                  className="pl-8"
                />
              </div>
              <select
                className="rounded-md border border-gray-200 p-2"
                value={returnStatus}
                onChange={(e) => setReturnStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Returns Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returns.list.map((return_) => (
                      <TableRow key={return_.id}>
                        <TableCell className="font-medium">#{return_.id}</TableCell>
                        <TableCell>#{return_.orderId}</TableCell>
                        <TableCell>{return_.customerName}</TableCell>
                        <TableCell>{return_.productName}</TableCell>
                        <TableCell>{return_.reason}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(return_.status)}>
                            {return_.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(return_.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReturn(return_)
                              setShowReturnDetails(true)
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {emailTemplates.list.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Label>Subject</Label>
                        <p className="text-sm text-gray-500">{template.subject}</p>
                      </div>
                      <div>
                        <Label>Content</Label>
                        <p className="text-sm text-gray-500">{template.content}</p>
                      </div>
                      <div>
                        <Label>Variables</Label>
                        <div className="flex flex-wrap gap-2">
                          {template.variables.map((variable) => (
                            <Badge key={variable} variant="secondary">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Order Details Dialog */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Order Information</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Order ID: #{selectedOrder.id}</p>
                      <p>Date: {new Date(selectedOrder.date).toLocaleString()}</p>
                      <p>Status: <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                      <p>Payment Method: {selectedOrder.paymentMethod}</p>
                      <p>Payment Status: {selectedOrder.paymentStatus}</p>
                      <p>Shipping Method: {selectedOrder.shippingMethod}</p>
                      <p>Tracking Number: {selectedOrder.trackingNumber}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Customer Information</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Name: {selectedOrder.customerName}</p>
                      <p>Email: {selectedOrder.customerEmail}</p>
                      <p>Address: {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium">Order Items</h3>
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-8 w-8 rounded-md object-cover"
                              />
                              <span>{item.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-medium">Order Notes</h3>
                    <p className="mt-2 text-sm text-gray-500">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                    Close
                  </Button>
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button>
                    <PackageIcon className="mr-2 h-4 w-4" />
                    Update Status
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Return Details Dialog */}
        <Dialog open={showReturnDetails} onOpenChange={setShowReturnDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Return Details</DialogTitle>
            </DialogHeader>
            {selectedReturn && (
              <div className="space-y-6">
                {/* Return Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Return Information</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Return ID: #{selectedReturn.id}</p>
                      <p>Order ID: #{selectedReturn.orderId}</p>
                      <p>Date: {new Date(selectedReturn.date).toLocaleString()}</p>
                      <p>Status: <Badge className={getStatusColor(selectedReturn.status)}>{selectedReturn.status}</Badge></p>
                      <p>Product: {selectedReturn.productName}</p>
                      <p>Quantity: {selectedReturn.quantity}</p>
                      <p>Reason: {selectedReturn.reason}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Customer Information</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Name: {selectedReturn.customerName}</p>
                    </div>
                  </div>
                </div>

                {/* Return Notes */}
                {selectedReturn.notes && (
                  <div>
                    <h3 className="font-medium">Return Notes</h3>
                    <p className="mt-2 text-sm text-gray-500">{selectedReturn.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowReturnDetails(false)}>
                    Close
                  </Button>
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Status
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Email Dialog */}
        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Email</DialogTitle>
            </DialogHeader>
            {selectedTemplate && selectedOrder && (
              <div className="space-y-4">
                <div>
                  <Label>Template</Label>
                  <p className="text-sm text-gray-500">{selectedTemplate.name}</p>
                </div>
                <div>
                  <Label>Subject</Label>
                  <p className="text-sm text-gray-500">{selectedTemplate.subject}</p>
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={selectedTemplate.content}
                    readOnly
                    className="h-32"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSendEmail(selectedTemplate, selectedOrder)}>
                    Send Email
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

