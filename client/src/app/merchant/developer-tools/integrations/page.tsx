import { IntegrationList } from "@/components/developer/integration-list"
import { PageHeader } from "@/components/ui/page-header"

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader title="Integration Dashboard" description="Manage your connected services and integrations" />
      <IntegrationList />
    </div>
  )
}
