"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiKeyList } from "@/components/developer/api-key-list"
import { MarketplaceList } from "@/components/developer/marketplace-list"
import { IntegrationList } from "@/components/developer/integration-list"
import { PageHeader } from "@/components/ui/page-header"

export default function DeveloperToolsPage() {
  const [activeTab, setActiveTab] = useState("api-keys")

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Developer Tools"
        description="Manage your API keys, integrations, and explore the marketplace"
      />

      <Tabs defaultValue="api-keys" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integration Dashboard</TabsTrigger>
          <TabsTrigger value="marketplace">Product Marketplace</TabsTrigger>
        </TabsList>
        <TabsContent value="api-keys" className="mt-6">
          <ApiKeyList />
        </TabsContent>
        <TabsContent value="integrations" className="mt-6">
          <IntegrationList />
        </TabsContent>
        <TabsContent value="marketplace" className="mt-6">
          <MarketplaceList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
