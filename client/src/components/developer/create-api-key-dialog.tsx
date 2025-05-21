"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import useApiKeyStore from "@/store/useApiKeyStore"

export function CreateApiKeyDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const { generateApiKey } = useApiKeyStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Please enter a name for your API key")
      return
    }
    try {
      setIsGenerating(true)
      const result = await generateApiKey(name)
      setNewKey(result.key ?? null)
      toast.success("API key generated successfully!", { className: "bg-green-600 text-white" })
    } catch (error) {
      toast.error("Failed to generate API key", { className: "bg-red-600 text-white" })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setName("")
    setNewKey(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Generate new API key">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Key
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full p-0 rounded-xl overflow-visible">
        <div className="bg-card rounded-xl w-full">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key to access the ConnectX API. Make sure to copy your key as you won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 pt-2">
            {newKey ? (
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-4 flex flex-col gap-2">
                  <p className="text-sm font-medium mb-1">Your new API key:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-background rounded text-sm font-mono overflow-x-auto select-all border border-muted-foreground/20 min-w-0 max-w-full whitespace-nowrap">
                      {newKey}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label="Copy API key"
                      onClick={() => {
                        if (newKey) {
                          navigator.clipboard.writeText(newKey)
                          toast.success("API key copied to clipboard", { className: "bg-green-600 text-white" })
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <DialogFooter className="flex justify-end">
                  <Button onClick={handleClose} className="w-full sm:w-auto">Done</Button>
                </DialogFooter>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production API Key"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="API key name"
                  />
                </div>
                <DialogFooter className="flex justify-end">
                  <Button type="submit" disabled={isGenerating} className="w-full sm:w-auto">
                    {isGenerating ? "Generating..." : "Generate Key"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
