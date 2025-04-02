import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface ApiKeyManagerProps {
  apiKey?: string
  onRegenerateKey?: () => void
}

export function ApiKeyManager({ apiKey, onRegenerateKey }: ApiKeyManagerProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setIsCopied(true)
      toast({
        title: "API Key copied",
        description: "Your API key has been copied to the clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Your API Key</Label>
          <div className="flex gap-2">
            <Input
              id="apiKey"
              type="password"
              value={apiKey || ""}
              readOnly
              className="font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={!apiKey}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Keep your API key secure and never share it publicly.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRegenerateKey}
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate API Key
        </Button>
      </CardContent>
    </Card>
  )
} 