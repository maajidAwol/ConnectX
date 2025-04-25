import type { ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface WarningAlertProps {
  title: string
  description: ReactNode
}

export function WarningAlert({ title, description }: WarningAlertProps) {
  return (
    <Alert className="bg-amber-50 text-amber-800 border-amber-200">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
