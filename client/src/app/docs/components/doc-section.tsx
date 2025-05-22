"use client"

import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"

interface DocSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function DocSection({ title, children, defaultOpen = false }: DocSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  )
} 