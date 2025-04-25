import { ApiKeyDisplay } from "@/components/developer/api-key-display"
import { PageHeader } from "@/components/ui/page-header"

// This would typically come from your backend/API
const mockApiKey = {
  key: "pk_live_51NzQweSH7SWVfKdUeOA6rJYEt4lkuM9qIRLzwOYWZOK",
  createdAt: "April 15, 2023",
  lastUsed: "2 hours ago"
}

export default function ApiKeyPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader 
        title="API Key" 
        description="Your API key for accessing the ConnectX API. This key was generated when you registered." 
      />
      <ApiKeyDisplay 
        apiKey={mockApiKey.key}
        createdAt={mockApiKey.createdAt}
        lastUsed={mockApiKey.lastUsed}
      />
    </div>
  )
}