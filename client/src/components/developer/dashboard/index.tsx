import { DeveloperStats } from './developer-stats'
import { ProjectList } from './project-list'
import { RecentActivity } from './recent-activity'
import { ApiKeyManager } from './api-key-manager'

export function DeveloperDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DeveloperStats />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <ProjectList />
          <ApiKeyManager />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
} 