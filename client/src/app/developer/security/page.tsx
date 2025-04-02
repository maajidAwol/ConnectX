"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function SecurityPage() {
  const [ipWhitelist, setIpWhitelist] = useState("")
  const [isIpWhitelistEnabled, setIsIpWhitelistEnabled] = useState(false)
  const { toast } = useToast()

  const handleSaveIpWhitelist = () => {
    // In a real app, this would call your API
    toast({
      title: "IP Whitelist Updated",
      description: "Your IP whitelist has been updated successfully.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your security preferences and access controls.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>IP Whitelist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable IP Whitelist</Label>
              <p className="text-sm text-muted-foreground">
                Restrict API access to specific IP addresses
              </p>
            </div>
            <Switch
              checked={isIpWhitelistEnabled}
              onCheckedChange={setIsIpWhitelistEnabled}
            />
          </div>

          {isIpWhitelistEnabled && (
            <div className="space-y-2">
              <Label htmlFor="ipWhitelist">Allowed IP Addresses</Label>
              <Input
                id="ipWhitelist"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="Enter IP addresses (comma-separated)"
              />
              <p className="text-sm text-muted-foreground">
                Enter IP addresses separated by commas (e.g., 192.168.1.1, 10.0.0.1)
              </p>
              <Button onClick={handleSaveIpWhitelist}>
                Save IP Whitelist
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Key Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key Rotation</Label>
            <p className="text-sm text-muted-foreground">
              Your API key was last rotated 30 days ago
            </p>
            <Button variant="outline">
              Rotate API Key
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Last Used</Label>
            <p className="text-sm text-muted-foreground">
              Your API key was last used 2 hours ago
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-md">
                <div>
                  <p className="font-medium">API Key Used</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(Date.now() - i * 1000 * 60 * 60).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  IP: 192.168.1.1
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 