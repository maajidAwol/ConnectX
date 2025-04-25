"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, UserPlus } from "lucide-react"
import { customers } from "@/lib/data"

import { PageHeader } from "@/components/ui/page-header"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterBar } from "@/components/ui/filter-bar"
import { FilterSelect } from "@/components/ui/filter-select"
import { CustomerList } from "@/components/customers/customer-list"

export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("orders")
  const [sortDirection, setSortDirection] = useState("desc")

  // Filter customers based on search query and filters
  const filteredCustomers = customers
    .filter((customer) => {
      // Search filter
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Convert string values to numbers for comparison where applicable
      let valueA: string | number = a[sortField as keyof typeof a] as string
      let valueB: string | number = b[sortField as keyof typeof b] as string

      if (sortField === "orders") {
        valueA = a.orders
        valueB = b.orders
      } else if (sortField === "totalSpent") {
        valueA = Number.parseInt(a.totalSpent.replace(/\D/g, ""), 10)
        valueB = Number.parseInt(b.totalSpent.replace(/\D/g, ""), 10)
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const statusOptions = [
    { value: "all", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Management" description="View and manage your customer base">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4" />
          <span>Add Customer</span>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          placeholder="Search customers by name, email, or phone..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <FilterBar>
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
        </FilterBar>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="recent">Recent Customers</TabsTrigger>
          <TabsTrigger value="active">Active Customers</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <CustomerList customers={filteredCustomers} onSort={handleSort} sortField={sortField} />
        </TabsContent>

        <TabsContent value="recent">
          <CustomerList
            customers={filteredCustomers.filter(
              (customer) => customer.lastPurchase.includes("day") || customer.lastPurchase.includes("hour"),
            )}
            onSort={handleSort}
            sortField={sortField}
            emptyMessage="No recent customers found."
          />
        </TabsContent>

        <TabsContent value="active">
          <CustomerList
            customers={filteredCustomers.filter((customer) => customer.status === "Active" && customer.orders > 3)}
            onSort={handleSort}
            sortField={sortField}
            emptyMessage="No active customers found."
          />
        </TabsContent>

        <TabsContent value="inactive">
          <CustomerList
            customers={filteredCustomers.filter((customer) => customer.status === "Inactive")}
            onSort={handleSort}
            sortField={sortField}
            emptyMessage="No inactive customers found."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
