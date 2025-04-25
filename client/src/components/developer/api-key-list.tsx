"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { ApiKeyItem } from "@/components/developer/api-key-item"
import { CreateApiKeyDialog } from "@/components/developer/create-api-key-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Mock data for API keys
const initialApiKeys = [
  {
    id: "key_1",
    name: "Production API Key",
    key: "pk_live_51NzQweSH7SWVfKdUeOA6rJYEt4lkuM9qIRLzwOYWZOK",
    createdAt: "April 15, 2023",
    lastUsed: "2 hours ago",
    permissions: ["read:products", "read:orders", "read:customers", "read:analytics"],
    status: "active" as const,
    expiresAt: "May 15, 2024",
  },
  {
    id: "key_2",
    name: "Development API Key",
    key: "pk_test_51NzQweSH7SWVfKdUeOA6rJYEt4lkuM9qIRLzwOYWZOK",
    createdAt: "January 10, 2023",
    lastUsed: "5 days ago",
    permissions: [
      "read:products",
      "write:products",
      "read:orders",
      "write:orders",
      "read:customers",
      "write:customers",
      "read:analytics",
    ],
    status: "active" as const,
    expiresAt: null,
  },
  {
    id: "key_3",
    name: "Testing API Key",
    key: "pk_test_51MzQweSH7SWVfKdUeOA6rJYEt4lkuM9qIRLzwOYWZOK",
    createdAt: "December 5, 2022",
    lastUsed: null,
    permissions: ["read:products", "read:orders"],
    status: "revoked" as const,
    expiresAt: "March 5, 2023",
  },
]

export function ApiKeyList() {
  const [apiKeys, setApiKeys] = useState(initialApiKeys)
  const [newKeyData, setNewKeyData] = useState<{
    key: string
    name: string
  } | null>(null)

  const handleCreateKey = (data: {
    name: string
    permissions: string[]
    expiresIn: number | null
  }) => {
    // Generate a random key (in a real app, this would come from the backend)
    const newKey = `pk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`

    // Calculate expiration date
    const expiresAt = data.expiresIn
      ? new Date(Date.now() + data.expiresIn * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null

    const newApiKey = {
      id: `key_${apiKeys.length + 1}`,
      name: data.name,
      key: newKey,
      createdAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      lastUsed: null,
      permissions: data.permissions,
      status: "active" as const,
      expiresAt,
    }

    setApiKeys([newApiKey, ...apiKeys])
    setNewKeyData({
      key: newKey,
      name: data.name,
    })
  }

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map((key) => (key.id === id ? { ...key, status: "revoked" as const } : key)))
  }

  const handleRenewKey = (id: string) => {
    // In a real app, this would generate a new key from the backend
    const newKey = `pk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`

    setApiKeys(
      apiKeys.map((key) =>
        key.id === id
          ? {
              ...key,
              key: newKey,
              status: "active" as const,
              createdAt: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              expiresAt: key.expiresAt
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null,
            }
          : key,
      ),
    )

    setNewKeyData({
      key: newKey,
      name: apiKeys.find((key) => key.id === id)?.name || "",
    })
  }

  const dismissNewKeyAlert = () => {
    setNewKeyData(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">API Keys</h3>
          <p className="text-sm text-muted-foreground">Manage your API keys for accessing the ConnectX API</p>
        </div>
        <CreateApiKeyDialog onCreateKey={handleCreateKey} />
      </div>

      {newKeyData && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">New API Key Created</AlertTitle>
          <AlertDescription className="text-green-700">
            <p>
              Your new API key <strong>{newKeyData.name}</strong> has been created. Please copy this key now as you
              won't be able to see it again.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="rounded bg-white px-2 py-1 text-sm font-mono border border-green-200">
                {newKeyData.key}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-green-200 text-green-700 hover:text-green-800 hover:bg-green-100"
                onClick={() => {
                  navigator.clipboard.writeText(newKeyData.key)
                }}
              >
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-green-700 hover:text-green-800 hover:bg-green-100"
                onClick={dismissNewKeyAlert}
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <ApiKeyItem
            key={apiKey.id}
            id={apiKey.id}
            name={apiKey.name}
            apiKey={apiKey.key}
            createdAt={apiKey.createdAt}
            lastUsed={apiKey.lastUsed}
            permissions={apiKey.permissions}
            status={apiKey.status}
            expiresAt={apiKey.expiresAt}
            onRevoke={handleRevokeKey}
            onRenew={handleRenewKey}
          />
        ))}
      </div>
    </div>
  )
}
