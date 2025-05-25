"use client"

import { useState, useEffect } from "react"
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
import useSingleOrderStore from "@/store/useSingleOrderStore"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import * as React from "react"

const statusOptions = [
  { value: "confirmed", label: "Confirmed" },
  { value: "rejected", label: "Rejected" },
  { value: "shipped", label: "Shipped" },
  { value: "failed", label: "Failed" },
  { value: "processing", label: "Processing" },
]

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const [customerNote, setCustomerNote] = useState("")
  const { order, isLoading, error, fetchOrder, updateOrderStatus } = useSingleOrderStore()
  const unwrappedParams = React.use(params)
  const orderId = unwrappedParams.id

  useEffect(() => {
    fetchOrder(orderId)
  }, [orderId, fetchOrder])

  // Handle status change
  const handleStatusChange = async (value: string) => {
    if (!order) return
    try {
      await updateOrderStatus(order.id, value)
      toast.success("Order status updated successfully!")
      fetchOrder(order.id)
    } catch (err: any) {
      toast.error("Failed to update order status.")
    }
  }

  // Better skeleton for the whole page
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-1/4" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 w-full md:col-span-2" />
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }
  if (!order) {
    return null
  }

  // Calculate totals from backend fields
  const subtotal = parseFloat(order.subtotal)
  const shipping = parseFloat(order.shipping)
  const tax = parseFloat(order.taxes)
  const discount = parseFloat(order.discount)
  const total = parseFloat(order.total_amount)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/merchant/orders" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">
          Order Details: {order.order_number}
        </h2>
        <Badge variant="outline" className="ml-2 capitalize">{order.status}</Badge>
        <div className="ml-4">
          <Select value={order.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-muted-foreground text-sm">
            Placed on {new Date(order.created_at).toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm">
            Seller: {order.seller_tenant_name}
          </span>
          <span className="text-muted-foreground text-sm">
            Customer: {order.user_name}
          </span>
          <span className="text-muted-foreground text-sm">
            Email: {order.email}
          </span>
          <span className="text-muted-foreground text-sm">
            Phone: {order.phone}
          </span>
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

      {/* Order Items and Customer Info */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Items Table */}
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
                {order.items.map((item) => {
                  const price = parseFloat(item.price)
                  const total = price * item.quantity
                  return (
                    <div key={item.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-6 flex items-center gap-2">
                        {item.product_details.cover_url && (
                          <img
                            src={item.product_details.cover_url}
                            alt={item.product_details.name}
                            className="h-10 w-10 rounded object-cover border"
                          />
                        )}
                        <div>
                          <div className="font-medium">{item.product_details.name}</div>
                          <div className="text-xs text-muted-foreground">SKU: {item.product_details.sku}</div>
                          <div className="text-xs text-muted-foreground">Owner: {item.product_owner_tenant_name}</div>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">${price.toFixed(2)}</div>
                      <div className="col-span-2 text-center">{item.quantity}</div>
                      <div className="col-span-2 text-right font-medium">${total.toFixed(2)}</div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer and Shipping Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <div className="font-medium">{order.user_name}</div>
                  <div className="text-sm text-muted-foreground">{order.email}</div>
                  <div className="text-sm text-muted-foreground">{order.phone}</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Shipping Address</div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{order.shipping_address_details?.full_address || "-"}</span>
                </div>
                <div className="text-xs text-muted-foreground">Phone: {order.shipping_address_details?.phone_number || "-"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Fulfillment/Status Section (optional, can be improved further) */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Fulfillment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{order.status}</Badge>
                <span className="text-xs text-muted-foreground">Last updated: {new Date(order.updated_at).toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground">Notes: {order.notes || "-"}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline/History, Notes, Inventory Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Order Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes & Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track the progress of this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.history && order.history.length > 0 ? (
                  order.history.map((h, idx) => (
                    <div className="flex gap-3" key={idx}>
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                        {idx < order.history.length - 1 && <div className="h-full w-px bg-border" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{h.status}</div>
                        <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</div>
                        <div className="mt-1 text-sm">{h.description}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">No timeline history available.</div>
                )}
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
                      <span className="text-xs text-muted-foreground">{order.created_at && new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-sm">{order.notes || "No notes from customer."}</p>
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
      </Tabs>
    </div>
  )
}
