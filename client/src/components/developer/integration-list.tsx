"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Mock data for integrations
const integrations = [
  {
    id: "1",
    name: "Payment Gateway",
    description: "Process payments securely with our payment gateway integration",
    status: "active",
    lastSync: "2 hours ago",
    category: "Payments",
  },
  {
    id: "2",
    name: "Inventory Management",
    description: "Sync your inventory across multiple platforms",
    status: "active",
    lastSync: "1 day ago",
    category: "Inventory",
  },
  {
    id: "3",
    name: "Email Marketing",
    description: "Send automated emails to your customers",
    status: "inactive",
    lastSync: "Never",
    category: "Marketing",
  },
]

export function IntegrationList() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Integration Dashboard</h3>
        <p className="text-sm text-muted-foreground">Manage your connected services and integrations</p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{integration.name}</CardTitle>
                <Badge variant={integration.status === "active" ? "default" : "secondary"}>
                  {integration.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={`activate-${integration.id}`}>Activate</Label>
                    <p className="text-sm text-muted-foreground">
                      {integration.status === "active"
                        ? "This integration is currently active"
                        : "Activate this integration to use it"}
                    </p>
                  </div>
                  <Switch id={`activate-${integration.id}`} checked={integration.status === "active"} />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Category:</span> {integration.category}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Last Sync:</span> {integration.lastSync}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Configure</Button>
              <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                Disconnect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
