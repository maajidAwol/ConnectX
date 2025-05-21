"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Key, Trash2, AlertTriangle } from "lucide-react"
import useApiKeyStore from "@/store/useApiKeyStore"
import { Skeleton } from "@/components/ui/skeleton"


function ApiKeySkeleton() {
  return (
    <Card className="w-full bg-card rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-16" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ApiKeyList() {
  const { apiKeys, revokeApiKey, deleteApiKey, isLoading } = useApiKeyStore()
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleRevoke = async (id: string) => {
    try {
      setRevokingId(id)
      await revokeApiKey(id)
      toast.success("API key revoked successfully!", { className: "bg-green-600 text-white" })
    } catch (error) {
      toast.error("Failed to revoke API key", { className: "bg-red-600 text-white" })
    } finally {
      setRevokingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteApiKey(id)
      toast.success("API key deleted successfully!", { className: "bg-green-600 text-white" })
    } catch (error) {
      toast.error("Failed to delete API key", { className: "bg-red-600 text-white" })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <ApiKeySkeleton key={i} />
        ))}
      </div>
    )
  }

  if (apiKeys.length === 0) {
    return (
      <Card className="w-full bg-card rounded-lg shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Key className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No API keys found. Generate your first API key to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {apiKeys.map((apiKey) => (
        <Card key={apiKey.id} className="w-full bg-card rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium">{apiKey.name}</CardTitle>
              <CardDescription>
                Created {formatDistanceToNow(new Date(apiKey.created_at), { addSuffix: true })}
              </CardDescription>
            </div>
            <Badge variant={apiKey.is_active ? "default" : "destructive"}>
              {apiKey.is_active ? "Active" : "Revoked"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  ID: {apiKey.id}
                </p>
                {apiKey.revoked_at && (
                  <p className="text-sm text-muted-foreground">
                    Revoked {formatDistanceToNow(new Date(apiKey.revoked_at), { addSuffix: true })}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {apiKey.is_active ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" aria-label="Revoke API key">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to revoke this API key? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRevoke(apiKey.id)}
                          disabled={revokingId === apiKey.id}
                        >
                          {revokingId === apiKey.id ? "Revoking..." : "Revoke"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" aria-label="Delete API key">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this API key? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(apiKey.id)}
                          disabled={deletingId === apiKey.id}
                        >
                          {deletingId === apiKey.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
