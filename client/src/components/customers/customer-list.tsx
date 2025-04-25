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
        <button onClick={() => onSort("name")} className="flex items-center gap-2">
          <span>Customer</span>
        </button>
      ),
      cell: (customer: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-700" />
          </div>
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-xs text-muted-foreground">
              Customer since {new Date().getFullYear() - Math.floor(Math.random() * 3) - 1}
            </div>
          </div>
        </div>
      ),
      className: "col-span-4",
    },
    {
      id: "contact",
      header: "Contact",
      cell: (customer: any) => (
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{customer.phone}</span>
          </div>
        </div>
      ),
      className: "col-span-3",
    },
    {
      id: "orders",
      header: (
        <button onClick={() => onSort("orders")} className="flex items-center gap-2">
          <span>Orders</span>
        </button>
      ),
      cell: (customer: any) => (
        <StatusBadge status={`${customer.orders} orders`} className="bg-blue-50 text-blue-700 border-blue-200" />
      ),
      className: "col-span-2",
    },
    {
      id: "totalSpent",
      header: (
        <button onClick={() => onSort("totalSpent")} className="flex items-center gap-2">
          <span>Total Spent</span>
        </button>
      ),
      cell: (customer: any) => <div className="font-medium">{customer.totalSpent}</div>,
      className: "col-span-2",
    },
    {
      id: "actions",
      header: <div className="text-right">Actions</div>,
      cell: (customer: any) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </div>
      ),
      className: "col-span-1 text-right",
    },
  ]

  return <DataTable columns={columns} data={customers} emptyMessage={emptyMessage} />
}
