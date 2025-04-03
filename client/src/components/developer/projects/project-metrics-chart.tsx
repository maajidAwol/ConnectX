import { ProjectMetrics } from '@/types/developer'

interface ProjectMetricsChartProps {
  metrics: ProjectMetrics
}

export function ProjectMetricsChart({ metrics }: ProjectMetricsChartProps) {
  return (
    <div className="h-[100px] w-full bg-muted/20 rounded-md flex items-center justify-center">
      <div className="text-sm text-muted-foreground">
        Success Rate: {metrics.successRate}% | Requests: {metrics.totalRequests}
      </div>
    </div>
  )
} 