"use client"

import { useState } from "react"
import { Check, Copy, EyeIcon, EyeOffIcon, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ApiKeyItemProps {
  id: string
  name: string
  apiKey: string // Changed from 'key' to 'apiKey'
  createdAt: string
  lastUsed: string | null
  permissions: string[]
  status: "active" | "expired" | "revoked"
  expiresAt: string | null
  onRevoke: (id: string) => void
  onRenew: (id: string) => void
}

export function ApiKeyItem({
  id,
  name,
  apiKey, // Changed from 'key' to 'apiKey'
  createdAt,
  lastUsed,
  permissions,
  status,
  expiresAt,
  onRevoke,
  onRenew,
}: ApiKeyItemProps) {
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maskedKey = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : "Invalid Key"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "expired":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "revoked":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">{name}</h3>
                <Badge className={cn("text-xs", getStatusColor(status))}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono">{showKey ? apiKey : maskedKey}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowKey(!showKey)}
                  title={showKey ? "Hide API key" : "Show API key"}
                >
                  {showKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRenew(id)} disabled={status === "revoked"}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span>Renew Key</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRevoke(id)} disabled={status === "revoked"} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Revoke Key</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm">{createdAt}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Used</p>
              <p className="text-sm">{lastUsed || "Never"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expires</p>
              <p className="text-sm">{expiresAt || "Never"}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Permissions</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {permissions.map((permission) => (
                <Badge key={permission} variant="outline" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
