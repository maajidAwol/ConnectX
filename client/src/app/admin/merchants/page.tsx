"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
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

export default function MerchantManagement() {
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
  }, [])

  const handleTabChange = (value: string) => {
    setStatusFilter(value === "all" ? "" : value)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "created_at" | "-created_at")
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Merchant Management</h2>
        <p className="text-muted-foreground">Review and approve merchant applications</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="under_review">Under Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter || "all"} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {tenants.length} of {totalCount} applications
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search merchants..."
                value={searchQuery}
                onChange={handleSearch}
                className="h-9 w-[200px]"
              />
              <Button variant="outline" size="sm" onClick={refreshTenants}>
                Refresh
              </Button>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-[200px]" />
                      <Skeleton className="h-5 w-[120px]" />
                    </div>
                    <Skeleton className="h-4 w-[350px] mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Skeleton className="h-4 w-[150px] mb-2" />
                        <Skeleton className="h-4 w-[200px] mb-1" />
                        <Skeleton className="h-4 w-[180px]" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-[150px] mb-2" />
                        <Skeleton className="h-4 w-[220px] mb-1" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-4">
                      <Skeleton className="h-9 w-[100px]" />
                      <Skeleton className="h-9 w-[100px]" />
                      <Skeleton className="h-9 w-[100px]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <>
              {tenants.map((merchant) => (
                <Card key={merchant.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{merchant.name}</CardTitle>
                      {merchant.tenant_verification_status === "pending" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Pending Review</span>
                        </Badge>
                      )}
                      {merchant.tenant_verification_status === "under_review" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Under Review</span>
                        </Badge>
                      )}
                      {merchant.tenant_verification_status === "approved" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Approved</span>
                        </Badge>
                      )}
                      {merchant.tenant_verification_status === "rejected" && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          <span>Rejected</span>
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Applied on {new Date(merchant.created_at).toLocaleDateString()}
                      {merchant.tenant_verification_date &&
                        ` • ${merchant.tenant_verification_status} on ${new Date(merchant.tenant_verification_date).toLocaleDateString()}`}
                      {merchant.business_type && ` • ${merchant.business_type}`}
                      {merchant.address && ` • ${merchant.address}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                        <p className="text-sm">{merchant.email}</p>
                        {merchant.phone && <p className="text-sm">{merchant.phone}</p>}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Business Details</h4>
                        {merchant.legal_name && <p className="text-sm">Legal Name: {merchant.legal_name}</p>}
                        {merchant.business_registration_number && (
                          <p className="text-sm">Registration #: {merchant.business_registration_number}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {(merchant.tenant_verification_status === "pending" ||
                        merchant.tenant_verification_status === "under_review") && (
                        <>
                          <Button variant="destructive" size="sm">
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </>
                      )}
                      {merchant.tenant_verification_status === "approved" && (
                        <Button variant="destructive" size="sm">
                          Revoke Approval
                        </Button>
                      )}
                      {merchant.tenant_verification_status === "rejected" && (
                        <Button size="sm">Reconsider Application</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink onClick={() => setPage(i + 1)} isActive={currentPage === i + 1}>
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
