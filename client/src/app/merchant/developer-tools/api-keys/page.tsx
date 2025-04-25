import { ApiKeyList } from "@/components/developer/api-key-list"
import { PageHeader } from "@/components/ui/page-header"

export default function ApiKeysPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader title="API Keys" description="Manage your API keys for accessing the ConnectX API" />
      <ApiKeyList />
    </div>
  )
}
