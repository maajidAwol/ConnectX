"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ExternalLink, Printer, ShoppingBag } from "lucide-react"
import { orders } from "@/lib/data"

import { PageHeader } from "@/components/ui/page-header"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterBar } from "@/components/ui/filter-bar"
import { FilterSelect } from "@/components/ui/filter-select"
import { InfoAlert } from "@/components/ui/info-alert"
import { OrderList } from "@/components/orders/order-list"

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Filter orders based on search query and filters
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()

    // Date filter (simplified for demo)
    let matchesDate = true
    if (dateFilter === "today") {
      matchesDate = order.date.includes("hours ago") || order.date === "Today"
    } else if (dateFilter === "yesterday") {
      matchesDate = order.date === "Yesterday"
    } else if (dateFilter === "week") {
      matchesDate = !order.date.includes("month")
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Order Management" description="Manage orders from your e-commerce website">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </Button>
        <Button className="gap-2">
          <ExternalLink className="h-4 w-4" />
          <span>View E-commerce Site</span>
        </Button>
      </PageHeader>

      <InfoAlert
        title="Connected to Your E-commerce"
        description="Orders from your e-commerce website are automatically synced here. You can manage all customer orders from this dashboard."
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          placeholder="Search orders by ID, customer, or email..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <FilterBar>
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
          <FilterSelect value={dateFilter} onChange={setDateFilter} options={dateOptions} />
        </FilterBar>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="returns">Returns & Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OrderList orders={filteredOrders} />
        </TabsContent>

        <TabsContent value="processing">
          <OrderList
            orders={filteredOrders.filter((order) => order.status === "Processing")}
            emptyMessage="No processing orders found."
          />
        </TabsContent>

        <TabsContent value="shipped">
          <OrderList
            orders={filteredOrders.filter((order) => order.status === "Shipped")}
            emptyMessage="No shipped orders found."
          />
        </TabsContent>

        <TabsContent value="delivered">
          <OrderList
            orders={filteredOrders.filter((order) => order.status === "Delivered")}
            emptyMessage="No delivered orders found."
          />
        </TabsContent>

        <TabsContent value="returns">
          <div className="rounded-md border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-2">
              <div className="rounded-full bg-muted p-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No Returns or Refunds</h3>
              <p className="text-sm text-muted-foreground">
                There are currently no return or refund requests. When customers request returns, they will appear here.
              </p>
              <Button variant="outline" className="mt-4">
                View Return Policy
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
