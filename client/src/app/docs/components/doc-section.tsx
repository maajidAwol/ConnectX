"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface DocSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function DocSection({ title, children, defaultOpen = false }: DocSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  )
} 