import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

interface FilterBarProps {
  children: ReactNode
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="icon" className="h-10 w-10">
        <Filter className="h-4 w-4" />
        <span className="sr-only">Filter</span>
      </Button>
      {children}
    </div>
  )
}
