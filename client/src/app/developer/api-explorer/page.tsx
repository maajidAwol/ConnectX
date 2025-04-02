"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function APIExplorer() {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Explorer</h1>
        <p className="text-muted-foreground">Test and explore your API endpoints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Request</CardTitle>
          <CardDescription>Make requests to your API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="request" className="space-y-4">
            <TabsList>
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>

            <div className="flex gap-2 items-center">
              <select className="flex h-10 w-[100px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <Input placeholder="Enter API endpoint" className="flex-1" />
              <Button>Send</Button>
            </div>

            <TabsContent value="request" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Request Body</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea 
                    className="w-full h-[200px] rounded-md border border-input bg-background p-3 text-sm"
                    placeholder="{
  // Enter request body here
}"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="w-full h-[200px] rounded-md border border-input bg-muted p-3 text-sm">
                    {/* Response will appear here */}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="headers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Headers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Header name" className="flex-1" />
                    <Input placeholder="Header value" className="flex-1" />
                    <Button variant="outline" size="icon">+</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}

