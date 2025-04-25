import type { ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X } from "lucide-react"

interface ErrorAlertProps {
  title: string
  description: ReactNode
  errors?: string[]
}

export function ErrorAlert({ title, description, errors }: ErrorAlertProps) {
  return (
    <Alert className="bg-red-50 text-red-800 border-red-200">
      <X className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
        {errors && errors.length > 0 && (
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}
