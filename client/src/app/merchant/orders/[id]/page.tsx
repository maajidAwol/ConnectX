"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Download,
  ExternalLink,
  MapPin,
  Package,
  Printer,
  Truck,
  User,
} from "lucide-react"
import { orders } from "@/lib/data"

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shippingCarrier, setShippingCarrier] = useState("")
  const [customerNote, setCustomerNote] = useState("")

  // In a real app, we would fetch the order from an API
  // For demo purposes, we'll find it in our dummy data
  const order = orders.find((o) => o.id === `#${params.id}`) || orders[0]

  // Calculate order summary
  const subtotal = order.items.reduce((sum, item) => {
    const price = Number.parseFloat(item.price.replace("$", ""))
    return sum + price * item.quantity
  }, 0)
  const shipping = 10.0 // Example shipping cost
  const tax = subtotal * 0.15 // Example tax rate (15%)
  const total = subtotal + shipping + tax

  // Check if any items have low stock
  const hasLowStockItems = order.items.some((item) => {
    // In a real app, we would check the actual stock level
    // For demo purposes, we'll randomly determine if an item has low stock
    return item.lowStock === true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/merchant/orders" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Order Details: {order.id}</h2>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Badge
            variant="outline"
            className={
              order.status === "Processing"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : order.status === "Shipped"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : order.status === "Delivered"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
            }
          >
            {order.status}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Ordered {order.date}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button className="gap-2">
            <Truck className="h-4 w-4" />
            <span>Ship Order</span>
          </Button>
        </div>
      </div>

      {hasLowStockItems && (
        <div className="rounded-md bg-amber-50 p-4 text-amber-800 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Low Stock Warning</h3>
              <p className="text-sm">
                Some items in this order have low stock levels. Please check inventory and restock if necessary.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Items purchased in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              <div className="divide-y">
                {order.items.map((item, index) => {
                  const price = Number.parseFloat(item.price.replace("$", ""))
                  const total = price * item.quantity
                  const isLowStock = item.lowStock === true

                  return (
                    <div key={index} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-6">
                        <div className="font-medium">{item.product}</div>
                        {isLowStock && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>Low stock - only 2 remaining</span>
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 text-center">{item.price}</div>
                      <div className="col-span-2 text-center">{item.quantity}</div>
                      <div className="col-span-2 text-right font-medium">${total.toFixed(2)}</div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t p-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (15%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <div className="font-medium">{order.customer}</div>
                  <div className="text-sm text-muted-foreground">{order.email}</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Shipping Address</div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{order.shipping.address}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Shipping Method</div>
                <div className="text-sm text-muted-foreground">{order.shipping.method}</div>
              </div>
              {order.shipping.tracking && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Tracking Number</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{order.shipping.tracking}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <ExternalLink className="h-3 w-3" />
                      <span className="sr-only">Track</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fulfillment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.status === "Processing" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="tracking">Tracking Number</Label>
                    <Input
                      id="tracking"
                      placeholder="Enter tracking number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrier">Shipping Carrier</Label>
                    <select
                      id="carrier"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={shippingCarrier}
                      onChange={(e) => setShippingCarrier(e.target.value)}
                    >
                      <option value="">Select carrier</option>
                      <option value="fedex">FedEx</option>
                      <option value="ups">UPS</option>
                      <option value="usps">USPS</option>
                      <option value="dhl">DHL</option>
                    </select>
                  </div>
                  <Button className="w-full gap-2">
                    <Truck className="h-4 w-4" />
                    <span>Mark as Shipped</span>
                  </Button>
                </>
              ) : order.status === "Shipped" ? (
                <div className="space-y-4">
                  <div className="rounded-md bg-amber-50 p-3 text-amber-800">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span className="font-medium">In Transit</span>
                    </div>
                    <p className="mt-1 text-xs">
                      This order was shipped on April 15, 2023 via {order.shipping.method}.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Track Shipment</span>
                  </Button>
                  <Button className="w-full gap-2">
                    <Check className="h-4 w-4" />
                    <span>Mark as Delivered</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md bg-green-50 p-3 text-green-800">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span className="font-medium">Delivered</span>
                    </div>
                    <p className="mt-1 text-xs">This order was delivered on April 18, 2023.</p>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Generate Invoice</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Order Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes & Communication</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track the progress of this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="absolute top-8 h-full w-px bg-border"></div>
                  </div>
                  <div className="pb-8">
                    <div className="font-medium">Order Placed</div>
                    <div className="text-sm text-muted-foreground">April 15, 2023 at 10:24 AM</div>
                    <div className="mt-2 text-sm">
                      Order #{order.id} was placed by {order.customer} for ${total.toFixed(2)}.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                    </div>
                    <div className="absolute top-8 h-full w-px bg-border"></div>
                  </div>
                  <div className="pb-8">
                    <div className="font-medium">Order Processing</div>
                    <div className="text-sm text-muted-foreground">April 15, 2023 at 11:30 AM</div>
                    <div className="mt-2 text-sm">Order was processed and prepared for shipping.</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        order.status === "Shipped" || order.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status === "Shipped" || order.status === "Delivered" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Truck className="h-4 w-4" />
                      )}
                    </div>
                    <div className="absolute top-8 h-full w-px bg-border"></div>
                  </div>
                  <div className="pb-8">
                    <div className="font-medium">Order Shipped</div>
                    <div className="text-sm text-muted-foreground">
                      {order.status === "Shipped" || order.status === "Delivered"
                        ? "April 16, 2023 at 9:15 AM"
                        : "Pending"}
                    </div>
                    {(order.status === "Shipped" || order.status === "Delivered") && (
                      <div className="mt-2 text-sm">
                        Order was shipped via {order.shipping.method}. Tracking number: {order.shipping.tracking}.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        order.status === "Delivered" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status === "Delivered" ? <Check className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Order Delivered</div>
                    <div className="text-sm text-muted-foreground">
                      {order.status === "Delivered" ? "April 18, 2023 at 2:45 PM" : "Pending"}
                    </div>
                    {order.status === "Delivered" && (
                      <div className="mt-2 text-sm">Order was delivered to the customer.</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes & Communication</CardTitle>
              <CardDescription>Add notes or communicate with the customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Customer Note</span>
                      <span className="text-xs text-muted-foreground">April 15, 2023 at 10:24 AM</span>
                    </div>
                    <p className="mt-1 text-sm">
                      Please leave the package at the front door. Thank you for your service!
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Add a Note to Customer</Label>
                <Textarea
                  id="note"
                  placeholder="Type your message to the customer..."
                  rows={4}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                />
              </div>
              <Button>Send Message</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Impact</CardTitle>
              <CardDescription>See how this order affects your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Ordered</div>
                  <div className="col-span-2 text-center">Current Stock</div>
                  <div className="col-span-3 text-right">Status</div>
                </div>
                <div className="divide-y">
                  {order.items.map((item, index) => {
                    // In a real app, we would fetch the actual stock level
                    // For demo purposes, we'll simulate stock levels
                    const currentStock = item.lowStock ? 2 : Math.floor(Math.random() * 50) + 10
                    const stockStatus = currentStock < 5 ? "Low Stock" : currentStock < 15 ? "Medium Stock" : "In Stock"
                    const stockClass =
                      currentStock < 5
                        ? "text-red-600 bg-red-50"
                        : currentStock < 15
                          ? "text-amber-600 bg-amber-50"
                          : "text-green-600 bg-green-50"

                    return (
                      <div key={index} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-5 font-medium">{item.product}</div>
                        <div className="col-span-2 text-center">{item.quantity}</div>
                        <div className="col-span-2 text-center">{currentStock}</div>
                        <div className="col-span-3 text-right">
                          <Badge variant="outline" className={stockClass}>
                            {stockStatus}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View All Inventory</Button>
              <Button>Restock Items</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
