import type { ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface InfoAlertProps {
  title: string
  description: ReactNode
}

export function InfoAlert({ title, description }: InfoAlertProps) {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
