"use client"

import { Button } from "@/components/ui/button"
import { Mail, MoreHorizontal, PhoneCall, User } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"

interface CustomerListProps {
  customers: any[]
  onSort: (field: string) => void
  sortField: string
  emptyMessage?: string
}

export function CustomerList({
  customers,
  onSort,
  sortField,
  emptyMessage = "No customers found matching your criteria.",
}: CustomerListProps) {
  const columns = [
    {
      id: "name",
      header: (
        <button onClick={() => onSort("name")} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <span>Customer</span>
        </button>
      ),
      cell: (customer: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-blue-700" />
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{customer.name}</div>
            <div className="text-xs text-muted-foreground">
              Customer since {new Date().getFullYear() - Math.floor(Math.random() * 3) - 1}
            </div>
          </div>
        </div>
      ),
      className: "min-w-[250px]",
    },
    {
      id: "contact",
      header: "Contact",
      cell: (customer: any) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate max-w-[200px]">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate max-w-[200px]">{customer.phone}</span>
          </div>
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      id: "orders",
      header: (
        <button onClick={() => onSort("orders")} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <span>Orders</span>
        </button>
      ),
      cell: (customer: any) => (
        <StatusBadge 
          status={`${customer.orders} orders`} 
          className="bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap" 
        />
      ),
      className: "w-[120px]",
    },
    {
      id: "totalSpent",
      header: (
        <button onClick={() => onSort("totalSpent")} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <span>Total Spent</span>
        </button>
      ),
      cell: (customer: any) => (
        <div className="font-medium whitespace-nowrap">{customer.totalSpent}</div>
      ),
      className: "w-[120px]",
    },
    {
      id: "actions",
      header: <div className="text-right">Actions</div>,
      cell: (customer: any) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </div>
      ),
      className: "w-[80px] text-right",
    },
  ]

  return (
    <div className="w-full overflow-x-auto min-w-[800px]">
      <DataTable 
        columns={columns} 
        data={customers} 
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
