import { CheckCircle, Circle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type StepStatus = "upcoming" | "current" | "complete" | "error"

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StepStatus
  title: string
  description?: string
  onClick?: () => void
}

export function Step({ status, title, description, onClick, className, ...props }: StepProps) {
  return (
    <div 
      className={cn(
        "group flex flex-col items-center space-y-2 cursor-pointer", 
        onClick ? "cursor-pointer" : "cursor-default",
        className
      )} 
      onClick={onClick}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        {/* Step indicator */}
        <div 
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
            status === "upcoming" && "border-gray-300 bg-white text-gray-400",
            status === "current" && "border-primary bg-primary text-white",
            status === "complete" && "border-green-600 bg-green-600 text-white",
            status === "error" && "border-red-500 bg-red-500 text-white"
          )}
        >
          {status === "upcoming" && <Circle className="h-4 w-4" />}
          {status === "current" && <span className="text-xs font-medium">{title.charAt(0)}</span>}
          {status === "complete" && <CheckCircle className="h-4 w-4" />}
          {status === "error" && <XCircle className="h-4 w-4" />}
        </div>
        
        {/* Connection line */}
        <div 
          className={cn(
            "absolute top-4 left-8 h-[2px] w-full -translate-y-1/2",
            "hidden md:block",
            status === "upcoming" && "bg-gray-200",
            status === "current" && "bg-gray-200",
            status === "complete" && "bg-green-600",
            status === "error" && "bg-red-300"
          )}
        />
      </div>
      
      {/* Step text */}
      <div className="flex flex-col items-center text-center">
        <span 
          className={cn(
            "text-sm font-medium",
            status === "upcoming" && "text-muted-foreground",
            status === "current" && "text-primary",
            status === "complete" && "text-green-600",
            status === "error" && "text-red-500"
          )}
        >
          {title}
        </span>
        {/* {description && (
          <span className="text-xs text-muted-foreground max-w-[80px]">
            {description}
          </span>
        )} */}
      </div>
    </div>
  )
} 