"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Undo2 } from "lucide-react"
import { returnRequests } from "@/lib/data"

import { PageHeader } from "@/components/ui/page-header"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterBar } from "@/components/ui/filter-bar"
import { FilterSelect } from "@/components/ui/filter-select"
import { InfoAlert } from "@/components/ui/info-alert"
import { ReturnList } from "@/components/returns/return-list"

export default function ReturnsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  // Filter returns based on search query and filters
  const filteredReturns = returnRequests.filter((returnItem) => {
    // Search filter
    const matchesSearch =
      returnItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || returnItem.status.toLowerCase() === statusFilter.toLowerCase()

    // Date filter (simplified for demo)
    let matchesDate = true
    if (dateFilter === "week") {
      matchesDate = returnItem.date.includes("days ago") || returnItem.date.includes("yesterday")
    } else if (dateFilter === "month") {
      matchesDate = true // All dates in our demo data are within a month
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  // Process a return
  const handleProcessReturn = (id: string, action: string) => {
    setIsProcessing(id)

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(null)
    }, 1500)
  }

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
  ]

  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Returns & Refunds" description="Manage customer return requests and process refunds">
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Sync Returns</span>
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Undo2 className="h-4 w-4" />
          <span>Return Policy</span>
        </Button>
      </PageHeader>

      <InfoAlert
        title="Returns Management"
        description="Customer return requests from your e-commerce website appear here. You can approve, reject, or process refunds."
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          placeholder="Search returns by ID, order, or customer..."
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
          <TabsTrigger value="all">All Returns</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ReturnList returns={filteredReturns} onProcessReturn={handleProcessReturn} processingId={isProcessing} />
        </TabsContent>

        <TabsContent value="pending">
          <ReturnList
            returns={filteredReturns.filter((item) => item.status === "Pending")}
            onProcessReturn={handleProcessReturn}
            processingId={isProcessing}
            emptyMessage="No pending return requests found."
          />
        </TabsContent>

        <TabsContent value="approved">
          <ReturnList
            returns={filteredReturns.filter((item) => item.status === "Approved")}
            onProcessReturn={handleProcessReturn}
            processingId={isProcessing}
            emptyMessage="No approved return requests found."
          />
        </TabsContent>

        <TabsContent value="completed">
          <ReturnList
            returns={filteredReturns.filter((item) => item.status === "Completed")}
            onProcessReturn={handleProcessReturn}
            processingId={isProcessing}
            emptyMessage="No completed return requests found."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
