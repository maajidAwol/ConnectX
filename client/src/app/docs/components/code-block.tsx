'use client';
import { useState } from "react"
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export function CodeBlock({ code, language = "javascript", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-md bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        {title && <span className="text-sm text-gray-400">{title}</span>}
        <button
          onClick={copyToClipboard}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-300">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
} 