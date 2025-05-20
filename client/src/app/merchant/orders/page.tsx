"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ExternalLink, Printer, ShoppingBag } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterBar } from "@/components/ui/filter-bar"
import { FilterSelect } from "@/components/ui/filter-select"
import { InfoAlert } from "@/components/ui/info-alert"
import { OrderList } from "@/components/orders/order-list"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import useOrderStore from "@/store/useOrderStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrderManagement() {
  const { orders, isLoading, error, currentPage, totalPages, fetchOrders, setCurrentPage, pageSize } = useOrderStore()

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Generate pagination range with ellipsis for larger page sets
  const getPaginationRange = () => {
    if (totalPages <= 1) return []

    const maxVisiblePages = 5
    const range = []

    range.push(1)

    if (totalPages <= maxVisiblePages) {
      for (let i = 2; i <= totalPages; i++) {
        range.push(i)
      }
    } else {
      const leftBound = Math.max(2, currentPage - 1)
      const rightBound = Math.min(totalPages - 1, currentPage + 1)

      if (leftBound > 2) {
        range.push("...")
      }

      for (let i = leftBound; i <= rightBound; i++) {
        range.push(i)
      }

      if (rightBound < totalPages - 1) {
        range.push("...")
      }

      if (totalPages > 1) {
        range.push(totalPages)
      }
    }

    return range
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Order Management" description="Manage orders from your e-commerce website">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View Site</span>
          </Button>
        </div>
      </PageHeader>

      <InfoAlert
        title="Connected to Your E-commerce"
        description="Orders from your e-commerce website are automatically synced here. You can manage all customer orders from this dashboard."
      />
  
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar placeholder="Search orders by ID, customer, or email..." value="" onChange={() => {}} />

        <FilterBar>
          <FilterSelect
            value="all"
            onChange={() => {}}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
          <FilterSelect
            value="all"
            onChange={() => {}}
            options={[
              { value: "all", label: "All Dates" },
              { value: "today", label: "Today" },
              { value: "yesterday", label: "Yesterday" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ]}
          />
        </FilterBar>
      </div>

      <div className="border-b">
        <div className="overflow-x-auto">
          <Tabs defaultValue="all" className="min-w-[400px]">
            <TabsList className="justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="all"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
              >
                All Orders
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
              >
                Processing
              </TabsTrigger>
              <TabsTrigger
                value="shipped"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
              >
                Shipped
              </TabsTrigger>
              <TabsTrigger
                value="delivered"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
              >
                Delivered
              </TabsTrigger>
              <TabsTrigger
                value="returns"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
              >
                Returns
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="all">
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(pageSize || 10)].map((_, i) => (
                      
                      <Skeleton key={i} className="h-12 w-full rounded" />
                    ))}
                  </div>
                ) : (
                  <OrderList orders={orders} isLoading={isLoading} />
                )}
              </TabsContent>

              <TabsContent value="processing">
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(pageSize || 10)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded" />
                    ))}
                  </div>
                ) : (
                  <OrderList
                    orders={orders.filter((order) => order.status === "processing")}
                    isLoading={isLoading}
                    emptyMessage="No processing orders found."
                  />
                )}
              </TabsContent>

              <TabsContent value="shipped">
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(pageSize || 10)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded" />
                    ))}
                  </div>
                ) : (
                  <OrderList
                    orders={orders.filter((order) => order.status === "shipped")}
                    isLoading={isLoading}
                    emptyMessage="No shipped orders found."
                  />
                )}
              </TabsContent>

              <TabsContent value="delivered">
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(pageSize || 10)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded" />
                    ))}
                  </div>
                ) : (
                  <OrderList
                    orders={orders.filter((order) => order.status === "delivered")}
                    isLoading={isLoading}
                    emptyMessage="No delivered orders found."
                  />
                )}
              </TabsContent>

              <TabsContent value="returns">
                <div className="rounded-md border border-dashed p-4 md:p-8 text-center">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-2">
                    <div className="rounded-full bg-muted p-4">
                      <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">No Returns or Refunds</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      There are currently no return or refund requests. When customers request returns, they will appear
                      here.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 md:mt-4">
                      View Return Policy
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4 md:mt-6">
          <PaginationContent className="flex flex-wrap">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage <= 1 || isLoading ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {getPaginationRange().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <span className="px-2 md:px-3 py-2">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(Number(page))
                    }}
                    isActive={page === currentPage}
                    className={isLoading ? "pointer-events-none opacity-50" : ""}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage >= totalPages || isLoading ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
