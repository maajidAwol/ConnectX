import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Clock, Truck } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"

interface OrderListProps {
  orders: any[]
  emptyMessage?: string
}

export function OrderList({ orders, emptyMessage = "No orders found matching your criteria." }: OrderListProps) {
  const columns = [
    {
      id: "id",
      header: (
        <div className="flex items-center gap-2">
          <span>Order ID</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
      ),
      cell: (order: any) => (
        <div className="font-medium whitespace-nowrap">{order.id}</div>
      ),
      className: "w-[120px]",
    },
    {
      id: "customer",
      header: "Customer",
      cell: (order: any) => (
        <div className="space-y-1">
          <div className="font-medium">{order.customer}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{order.email}</div>
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      id: "date",
      header: (
        <div className="flex items-center gap-2">
          <span>Date</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
      ),
      cell: (order: any) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{order.date}</span>
        </div>
      ),
      className: "w-[150px]",
    },
    {
      id: "amount",
      header: "Amount",
      cell: (order: any) => (
        <div className="font-medium whitespace-nowrap">{order.amount}</div>
      ),
      className: "w-[100px] text-right",
    },
    {
      id: "status",
      header: "Status",
      cell: (order: any) => <StatusBadge status={order.status} />,
      className: "w-[120px]",
    },
    {
      id: "actions",
      header: <div className="text-right">Actions</div>,
      cell: (order: any) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild className="h-8">
            <Link href={`/merchant/orders/${order.id.replace("#", "")}`}>View</Link>
          </Button>
          {order.status === "Processing" && (
            <Button variant="outline" size="sm" className="h-8">
              <Truck className="h-4 w-4 mr-1" />
              <span>Ship</span>
            </Button>
          )}
        </div>
      ),
      className: "w-[160px] text-right",
    },
  ]

  return (
    <div className="w-full overflow-x-auto min-w-[900px]">
      <DataTable 
        columns={columns} 
        data={orders} 
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
