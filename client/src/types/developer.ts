export interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'archived' | 'draft'
  integrations: Integration[]
  metrics: ProjectMetrics
}

export interface Integration {
  id: string
  productId: string
  productName: string
  status: 'active' | 'inactive' | 'configuring'
  configurationStatus: {
    webhooks: boolean
    authentication: boolean
    basicSetup: boolean
  }
  lastSynced?: Date
}

export interface ProjectMetrics {
  totalRequests: number
  successRate: number
  averageLatency: number
  errorRate: number
  lastUpdated: Date
}

export interface DeveloperProfile {
  id: string
  apiKey: string
  apiKeyCreatedAt: Date
  apiKeyLastUsed?: Date
  usageQuota: {
    limit: number
    current: number
    resetDate: Date
  }
  projects: Project[]
}

export interface DeveloperStats {
  totalProjects: number
  activeIntegrations: number
  totalRequests: number
  successRate: number
}

export interface RecentActivity {
  id: string
  type: 'project_created' | 'integration_added' | 'api_call' | 'error'
  timestamp: Date
  details: string
  projectId?: string
} 