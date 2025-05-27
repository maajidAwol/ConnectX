"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Clock, Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"

interface ReturnListProps {
  returns: any[]
  onProcessReturn: (id: string, action: string) => void
  processingId: string | null
  emptyMessage?: string
}

export function ReturnList({
  returns,
  onProcessReturn,
  processingId,
  emptyMessage = "No return requests found matching your criteria.",
}: ReturnListProps) {
  const columns = [
    {
      id: "id",
      header: (
        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <span>Return ID</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
      ),
      cell: (returnItem: any) => (
        <div className="font-medium whitespace-nowrap">{returnItem.id}</div>
      ),
      className: "w-[120px]",
    },
    {
      id: "orderId",
      header: "Order ID",
      cell: (returnItem: any) => (
        <div className="whitespace-nowrap">{returnItem.orderId}</div>
      ),
      className: "w-[120px]",
    },
    {
      id: "customer",
      header: "Customer",
      cell: (returnItem: any) => (
        <div className="space-y-1">
          <div className="font-medium truncate max-w-[200px]">{returnItem.customer}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{returnItem.email}</div>
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      id: "date",
      header: (
        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <span>Date</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
      ),
      cell: (returnItem: any) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{returnItem.date}</span>
        </div>
      ),
      className: "w-[150px]",
    },
    {
      id: "status",
      header: "Status",
      cell: (returnItem: any) => <StatusBadge status={returnItem.status} />,
      className: "w-[120px]",
    },
    {
      id: "actions",
      header: <div className="text-right">Actions</div>,
      cell: (returnItem: any) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild className="h-8">
            <Link href={`/merchant/orders/returns/${returnItem.id.replace("return_", "")}`}>View</Link>
          </Button>
          {returnItem.status === "Pending" && (
            <Button
              size="sm"
              className="h-8 bg-blue-600 hover:bg-blue-700"
              onClick={() => onProcessReturn(returnItem.id, "approve")}
              disabled={processingId === returnItem.id}
            >
              {processingId === returnItem.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Process"}
            </Button>
          )}
        </div>
      ),
      className: "w-[180px] text-right",
    },
  ]

  return (
    <div className="w-full overflow-x-auto min-w-[900px]">
      <DataTable 
        columns={columns} 
        data={returns} 
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
