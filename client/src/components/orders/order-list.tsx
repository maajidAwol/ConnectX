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
      cell: (order: any) => <div className="font-medium">{order.id}</div>,
      className: "col-span-2",
    },
    {
      id: "customer",
      header: "Customer",
      cell: (order: any) => (
        <div>
          <div>{order.customer}</div>
          <div className="text-sm text-muted-foreground">{order.email}</div>
        </div>
      ),
      className: "col-span-3",
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
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{order.date}</span>
        </div>
      ),
      className: "col-span-2",
    },
    {
      id: "amount",
      header: "Amount",
      cell: (order: any) => <div className="font-medium">{order.amount}</div>,
      className: "col-span-1",
    },
    {
      id: "status",
      header: "Status",
      cell: (order: any) => <StatusBadge status={order.status} />,
      className: "col-span-2",
    },
    {
      id: "actions",
      header: <div className="text-right">Actions</div>,
      cell: (order: any) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/merchant/orders/${order.id.replace("#", "")}`}>View</Link>
          </Button>
          {order.status === "Processing" && (
            <Button variant="outline" size="sm">
              <Truck className="h-4 w-4 mr-1" />
              <span>Ship</span>
            </Button>
          )}
        </div>
      ),
      className: "col-span-2 text-right",
    },
  ]

  return <DataTable columns={columns} data={orders} emptyMessage={emptyMessage} />
}
