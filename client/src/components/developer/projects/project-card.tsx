import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Project } from '@/types/developer'
import { ProjectMetricsChart } from './project-metrics-chart'

interface ProjectCardProps {
  project: Project
  onEdit: (id: string) => void
  onArchive: (id: string) => void
}

export function ProjectCard({ project, onEdit, onArchive }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
          {project.status}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <ProjectMetricsChart metrics={project.metrics} />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Success Rate</p>
              <p className="text-2xl font-bold">
                {project.metrics.successRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Requests</p>
              <p className="text-2xl font-bold">
                {project.metrics.totalRequests.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Active Integrations</p>
            <div className="flex gap-2">
              {project.integrations.map((integration) => (
                <Badge key={integration.id} variant="outline">
                  {integration.productId}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onEdit(project.id)}>
          Edit
        </Button>
        <Button 
          variant="ghost" 
          className="text-destructive"
          onClick={() => onArchive(project.id)}
        >
          Archive
        </Button>
      </CardFooter>
    </Card>
  )
} 