import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check } from "lucide-react"

interface FormSuccessAlertProps {
  message: string
  visible: boolean
}

export function FormSuccessAlert({ message, visible }: FormSuccessAlertProps) {
  if (!visible) return null

  return (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <Check className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
