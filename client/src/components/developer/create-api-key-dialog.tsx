"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AVAILABLE_PERMISSIONS = [
  { id: "read:products", label: "Read Products" },
  { id: "write:products", label: "Write Products" },
  { id: "read:orders", label: "Read Orders" },
  { id: "write:orders", label: "Write Orders" },
  { id: "read:customers", label: "Read Customers" },
  { id: "write:customers", label: "Write Customers" },
  { id: "read:analytics", label: "Read Analytics" },
]

const EXPIRATION_OPTIONS = [
  { value: null, label: "Never" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 365, label: "1 year" },
]

interface CreateApiKeyDialogProps {
  onCreateKey: (data: { name: string; permissions: string[]; expiresIn: number | null }) => void
}

export function CreateApiKeyDialog({ onCreateKey }: CreateApiKeyDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [expiresIn, setExpiresIn] = useState<number | null>(30)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateKey({
      name,
      permissions: selectedPermissions,
      expiresIn,
    })
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setSelectedPermissions([])
    setExpiresIn(30)
  }

  const togglePermission = (permission: string) => {
    setSelectedPermissions((current) =>
      current.includes(permission) ? current.filter((p) => p !== permission) : [...current, permission],
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key to access the ConnectX API. You will only be able to view the key once.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Key Name</Label>
              <Input
                id="name"
                placeholder="Production API Key"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <Label htmlFor={permission.id} className="text-sm font-normal">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiration">Expiration</Label>
              <Select
                value={expiresIn === null ? "null" : expiresIn.toString()}
                onValueChange={(value) => setExpiresIn(value === "null" ? null : Number.parseInt(value))}
              >
                <SelectTrigger id="expiration">
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRATION_OPTIONS.map((option) => (
                    <SelectItem key={option.label} value={option.value === null ? "null" : option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || selectedPermissions.length === 0}>
              Create Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
