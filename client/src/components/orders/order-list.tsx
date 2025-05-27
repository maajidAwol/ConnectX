import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Clock, Truck, Loader2 } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import type { Order } from "@/store/useOrderStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

interface OrderListProps {
  orders: Order[]
  isLoading?: boolean
  emptyMessage?: string
}

export function OrderList({
  orders,
  isLoading,
  emptyMessage = "No orders found matching your criteria.",
}: OrderListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground mt-2">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="w-[40%] sm:w-[25%] lg:w-[15%]">
              <div className="flex items-center gap-1">
                <span>Order ID</span>
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="hidden sm:table-cell sm:w-[30%] lg:w-[20%]">Seller</TableHead>
            <TableHead className="hidden lg:table-cell lg:w-[15%]">
              <div className="flex items-center gap-1">
                <span>Date</span>
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="w-[25%] sm:w-[15%] lg:w-[10%] text-right">Amount</TableHead>
            <TableHead className="hidden sm:table-cell sm:w-[15%]">Status</TableHead>
            <TableHead className="w-[35%] sm:w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="group">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="truncate">{order.order_number}</span>
                  <span className="text-xs text-muted-foreground sm:hidden">{order.seller_tenant_name}</span>
                  <span className="sm:hidden">
                    <StatusBadge status={order.status} className="mt-1" />
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="truncate">{order.seller_tenant_name}</div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">${order.total_amount}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 sm:gap-2">
                  <Button variant="outline" size="sm" asChild className="h-8 px-2 sm:px-3">
                    <Link href={`/merchant/orders/${order.id}`}>View</Link>
                  </Button>
                  {/* {order.status === "processing" && (
                    <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3">
                      <Truck className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Ship</span>
                    </Button>
                  )} */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
