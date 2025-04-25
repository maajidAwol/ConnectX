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
        <div className="flex items-center gap-2">
          <span>Return ID</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
      ),
      cell: (returnItem: any) => <div className="font-medium">{returnItem.id}</div>,
      className: "col-span-2",
    },
    {
      id: "orderId",
      header: "Order ID",
      cell: (returnItem: any) => <div>{returnItem.orderId}</div>,
      className: "col-span-2",
    },
    {
      id: "customer",
      header: "Customer",
      cell: (returnItem: any) => (
        <div>
          <div>{returnItem.customer}</div>
          <div className="text-xs text-muted-foreground">{returnItem.email}</div>
        </div>
      ),
      className: "col-span-2",
    },
    {
      id: "date",
      header: (
        <div className="flex items-center gap-2">
          <span>Date</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
      ),
      cell: (returnItem: any) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{returnItem.date}</span>
        </div>
      ),
      className: "col-span-2",
    },
    {
      id: "status",
      header: "Status",
      cell: (returnItem: any) => <StatusBadge status={returnItem.status} />,
      className: "col-span-2",
    },
    {
      id: "actions",
      header: <div className="text-right">Actions</div>,
      cell: (returnItem: any) => (
        <div className="col-span-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/merchant/orders/returns/${returnItem.id.replace("return_", "")}`}>View</Link>
          </Button>
          {returnItem.status === "Pending" && (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onProcessReturn(returnItem.id, "approve")}
              disabled={processingId === returnItem.id}
            >
              {processingId === returnItem.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Process"}
            </Button>
          )}
        </div>
      ),
      className: "col-span-2 text-right",
    },
  ]

  return <DataTable columns={columns} data={returns} emptyMessage={emptyMessage} />
}
