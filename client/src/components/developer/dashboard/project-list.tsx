import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Project } from "@/types/developer"
import { Plus } from "lucide-react"
import { ProjectCard } from "../projects/project-card"

interface ProjectListProps {
  projects?: Project[]
  onEditProject?: (id: string) => void
  onArchiveProject?: (id: string) => void
  onCreateProject?: () => void
}

export function ProjectList({ 
  projects = [], 
  onEditProject, 
  onArchiveProject,
  onCreateProject 
}: ProjectListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <Button onClick={onCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No projects yet. Create your first project to get started.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={onEditProject || (() => {})}
                onArchive={onArchiveProject || (() => {})}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 