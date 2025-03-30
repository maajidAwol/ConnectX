"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Book,
  Code,
  Compass,
  FileCode,
  HelpCircle,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

const navigation = [
  {
    title: "Dashboard",
    href: "/developer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    href: "/developer/marketplace",
    icon: Compass,
  },
  {
    title: "My Integrations",
    href: "/developer/integrations",
    icon: Code,
  },
  {
    title: "API Explorer",
    href: "/developer/api-explorer",
    icon: Terminal,
  },
  {
    title: "Projects",
    href: "/developer/projects",
    icon: FileCode,
  },
  {
    title: "Documentation",
    href: "/developer/documentation",
    icon: Book,
  },
  {
    title: "Security",
    href: "/developer/security",
    icon: ShieldCheck,
  },
  {
    title: "Settings",
    href: "/developer/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/developer/help",
    icon: HelpCircle,
  },
]

export default function DeveloperApiExplorerPage() {
  const [endpoint, setEndpoint] = useState("/api/products")
  const [method, setMethod] = useState("GET")
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState("")

  const handleSendRequest = async () => {
    // Simulate API request
    setTimeout(() => {
      setResponse(
        JSON.stringify(
          {
            message: "API request successful",
            data: [
              { id: 1, name: "Wireless Earbuds Pro", price: 129.99 },
              { id: 2, name: "Smart Watch X2", price: 249.99 },
            ],
          },
          null,
          2,
        ),
      )
    }, 1000)
  }

  return (
    <DashboardLayout role="developer" navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">API Explorer</h1>
          <p className="text-muted-foreground">Explore and test the platform APIs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Request</CardTitle>
            <CardDescription>Enter the endpoint, method, and request body to test the API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                placeholder="/api/products"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <select
                id="method"
                className="w-full p-2 border rounded-md"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestBody">Request Body</Label>
              <Input
                id="requestBody"
                placeholder='{ "key": "value" }'
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
              />
            </div>
            <Button onClick={handleSendRequest}>Send Request</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API Response</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">
              <code>{response}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

