"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminStore } from "@/store/adminStore"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function AdminUsersPage() {
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null)
  const { admins, loading, totalCount, currentPage, pageSize, fetchAdmins, deleteAdmin, setPage } = useAdminStore()

  useEffect(() => {
    fetchAdmins(currentPage, pageSize)
  }, [currentPage, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return

    try {
      await deleteAdmin(adminToDelete)
      toast({
        title: "Success",
        description: "Administrator has been deleted successfully.",
        className: "bg-green-50 border-green-200 text-green-800",
      })
      setAdminToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete administrator",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      })
    }
  }

  const LoadingSkeleton = () => (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[60px] rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center">
        <Skeleton className="h-10 w-[300px]" />
      </div>
    </>
  )

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          <Link href="/admin/add-admin">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4 " />
              Add New
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{user.tenant_name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.is_active
                              ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                          }
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAdminToDelete(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!adminToDelete} onOpenChange={() => setAdminToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Administrator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this administrator? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
