"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface DocsPagerProps {
  prev?: {
    href: string
    label: string
  }
  next?: {
    href: string
    label: string
  }
}

export function DocsPager({ prev, next }: DocsPagerProps) {
  const router = useRouter()

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return

      if (e.key === "ArrowLeft" && prev) {
        router.push(prev.href)
      } else if (e.key === "ArrowRight" && next) {
        router.push(next.href)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [prev, next, router])

  return (
    <div className="flex flex-row items-center justify-between mt-12 border-t pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "gap-1 hover:bg-muted hover:border-emerald-500/50 transition-all",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          {prev.label}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "gap-1 hover:bg-muted hover:border-emerald-500/50 transition-all",
          )}
        >
          {next.label}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
