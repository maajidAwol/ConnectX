import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeveloperStats as DeveloperStatsType } from "@/types/developer"
import { Activity, Boxes, Network, Zap } from "lucide-react"

interface DeveloperStatsProps {
  stats?: DeveloperStatsType
}

export function DeveloperStats({ stats }: DeveloperStatsProps) {
  const defaultStats: DeveloperStatsType = {
    totalProjects: 0,
    activeIntegrations: 0,
    totalRequests: 0,
    successRate: 0
  }

  const currentStats = stats || defaultStats

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStats.totalProjects}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStats.activeIntegrations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStats.totalRequests.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStats.successRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </>
  )
} 