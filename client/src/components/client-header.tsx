"use client"

import { UserHeader } from "@/components/user-header"

interface ClientHeaderProps {
  title: string
}

export function ClientHeader({ title }: ClientHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 shadow-sm">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      {/* <UserHeader /> */}
    </header>
  )
} 