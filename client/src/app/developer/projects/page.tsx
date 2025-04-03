"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Project } from "@/types/developer"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Integration",
    description: "Main project for e-commerce integration",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
    integrations: [
      {
        id: "1",
        productId: "prod_1",
        productName: "Product Catalog",
        status: "active",
        configurationStatus: {
          webhooks: true,
          authentication: true,
          basicSetup: true
        },
        lastSynced: new Date()
      }
    ],
    metrics: {
      totalRequests: 500,
      successRate: 99.2,
      averageLatency: 120,
      errorRate: 0.8,
      lastUpdated: new Date()
    }
  }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: ""
  })
  const { toast } = useToast()

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      integrations: [],
      metrics: {
        totalRequests: 0,
        successRate: 0,
        averageLatency: 0,
        errorRate: 0,
        lastUpdated: new Date()
      }
    }

    setProjects([...projects, project])
    setNewProject({ name: "", description: "" })
    setIsCreateDialogOpen(false)
    
    toast({
      title: "Success",
      description: "Project created successfully"
    })
  }

  const handleArchiveProject = (id: string) => {
    setProjects(projects.map(project => 
      project.id === id 
        ? { ...project, status: "archived" as const }
        : project
    ))
    
    toast({
      title: "Success",
      description: "Project archived successfully"
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage your integration projects and their configurations.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Projects</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                  />
                </div>
                <Button onClick={handleCreateProject} className="w-full">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No projects yet. Create your first project to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Integrations</p>
                        <p className="text-2xl font-bold">
                          {project.integrations.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm font-medium capitalize">
                          {project.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleArchiveProject(project.id)}
                    >
                      Archive Project
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 