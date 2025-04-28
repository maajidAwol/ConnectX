import type React from "react"
import { cn } from "@/lib/utils"

interface DocPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
}

export function DocPageHeader({ heading, text, className, ...props }: DocPageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-lg text-muted-foreground">{text}</p>}
    </div>
  )
}
