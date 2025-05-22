"use client"
import { Button } from "@/components/ui/button"
import type React from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertCircle, Search, RefreshCw, Eye } from "lucide-react"
import { useTenantStore } from "@/store/tenantStore"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MerchantManagement() {
  const router = useRouter()
  const {
    tenants,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    sortOrder,
    fetchTenants,
    setPage,
    setSearchQuery,
    setStatusFilter,
    setSortOrder,
    refreshTenants,
  } = useTenantStore()

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants, currentPage, searchQuery, statusFilter, sortOrder])

  const handleTabChange = (value: string) => {
    setStatusFilter(value === "all" ? "" : value)
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery((e.target as HTMLInputElement).value)
    }
  }

  const handleSort = (value: string) => {
    const sortMap: Record<string, "created_at" | "-created_at" | "name" | "-name"> = {
      newest: "-created_at",
      oldest: "created_at",
      name_asc: "name",
      name_desc: "-name",
    }
    setSortOrder(sortMap[value] || "-created_at")
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  const MerchantCardSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Skeleton className="h-5 w-[150px] mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-[150px] mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <MerchantCardSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchTenants} className="mt-4">
            Try Again
          </Button>
        </div>
      )
    }

    if (tenants.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No merchants found</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{tenant.name}</CardTitle>
                  <CardDescription>{tenant.email}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {tenant.tenant_verification_status === "unverified" && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Unverified</span>
                    </Badge>
                  )}
                  {tenant.tenant_verification_status === "pending" && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Pending Review</span>
                    </Badge>
                  )}
                  {tenant.tenant_verification_status === "under_review" && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Under Review</span>
                    </Badge>
                  )}
                  {tenant.tenant_verification_status === "approved" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Approved</span>
                    </Badge>
                  )}
                  {tenant.tenant_verification_status === "rejected" && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      <span>Rejected</span>
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={() => router.push(`/admin/merchants/${tenant.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm">Email: {tenant.email}</p>
                    {tenant.phone && <p className="text-sm">Phone: {tenant.phone}</p>}
                    {tenant.address && <p className="text-sm">Address: {tenant.address}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Business Details</h4>
                  <div className="space-y-1">
                    {tenant.legal_name && <p className="text-sm">Legal Name: {tenant.legal_name}</p>}
                    {tenant.business_type && <p className="text-sm">Business Type: {tenant.business_type}</p>}
                    {tenant.business_registration_number && (
                      <p className="text-sm">Registration #: {tenant.business_registration_number}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Merchant Management</h2>
          <p className="text-muted-foreground">Manage and review merchant applications</p>
        </div>
        <Button onClick={refreshTenants} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search merchants..."
                defaultValue={searchQuery}
                onKeyDown={handleSearch}
                className="pl-8"
                disabled={loading}
              />
            </div>
            <Select
              value={
                sortOrder === "-created_at"
                  ? "newest"
                  : sortOrder === "created_at"
                    ? "oldest"
                    : sortOrder === "name"
                      ? "name_asc"
                      : sortOrder === "-name"
                        ? "name_desc"
                        : "newest"
              }
              onValueChange={handleSort}
              disabled={loading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {renderContent()}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          {renderContent()}
        </TabsContent>
        <TabsContent value="under_review" className="space-y-4">
          {renderContent()}
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          {renderContent()}
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          {renderContent()}
        </TabsContent>
      </Tabs>

      {totalPages > 1 && !loading && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(i + 1)
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
