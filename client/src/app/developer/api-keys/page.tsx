"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState("sk_test_123456789")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setIsCopied(true)
    toast({
      title: "API Key copied",
      description: "Your API key has been copied to the clipboard.",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleRegenerateKey = () => {
    // In a real app, this would call your API
    const newKey = `sk_test_${Math.random().toString(36).substring(2, 15)}`
    setApiKey(newKey)
    toast({
      title: "API Key regenerated",
      description: "Your API key has been regenerated successfully.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">
          Manage your API keys and access credentials.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep your API key secure and never share it publicly.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Usage Quota</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Monthly Limit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">100,000</div>
                  <p className="text-xs text-muted-foreground">requests</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Current Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,678</div>
                  <p className="text-xs text-muted-foreground">requests</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Reset Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15 days</div>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate API Key
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate API Key</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will invalidate your current API key and generate a new one.
                  Any applications using the current key will stop working until they are updated with the new key.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRegenerateKey}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
} 