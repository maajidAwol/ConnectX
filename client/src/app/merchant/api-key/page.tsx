"use client"

import { useEffect } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { ApiKeyList } from "@/components/developer/api-key-list"
import { CreateApiKeyDialog } from "@/components/developer/create-api-key-dialog"
import useApiKeyStore from "@/store/useApiKeyStore"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ApiKeyPage() {
  const { apiKeys, isLoading, error, fetchApiKeys } = useApiKeyStore()

  useEffect(() => {
    fetchApiKeys()
  }, [fetchApiKeys])

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="API Keys" 
          description="Manage your API keys for accessing the ConnectX API. Generate new keys, revoke existing ones, or delete them when no longer needed." 
        />
        <CreateApiKeyDialog />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ApiKeyList />
      )}
    </div>
  )
}