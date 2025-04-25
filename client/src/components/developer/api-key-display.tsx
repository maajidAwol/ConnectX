"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy } from "lucide-react"
import { useState } from "react"

interface ApiKeyDisplayProps {
  apiKey: string
  createdAt: string
  lastUsed?: string | null
}

export function ApiKeyDisplay({ apiKey, createdAt, lastUsed }: ApiKeyDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Your API Key</h3>
        <p className="text-sm text-muted-foreground">
          This API key was generated when you registered. Keep it secure and never share it publicly.
        </p>
      </div>

      <Alert className="bg-green-50 border-green-200">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">API Key</AlertTitle>
        <AlertDescription className="text-green-700">
          <div className="mt-2 flex items-center gap-2">
            <code className="rounded bg-white px-2 py-1 text-sm font-mono border border-green-200">
              {apiKey}
            </code>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-green-200 text-green-700 hover:text-green-800 hover:bg-green-100"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>Created: {createdAt}</p>
        {lastUsed && <p>Last used: {lastUsed}</p>}
      </div>
    </div>
  )
} 