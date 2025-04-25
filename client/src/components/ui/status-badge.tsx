import { Badge } from "@/components/ui/badge"

type StatusType =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"

interface StatusBadgeProps {
  status: StatusType | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-amber-50 text-amber-700 border-amber-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    approved: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-50 text-gray-700 border-gray-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
  }

  const statusStyle = statusStyles[status.toLowerCase()] || statusStyles.default

  return (
    <Badge variant="outline" className={`${statusStyle} ${className || ""}`}>
      {status}
    </Badge>
  )
}
