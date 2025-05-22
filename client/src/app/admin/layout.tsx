import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import ProtectedRoute from "@/components/protected-route"
import { Toaster } from "@/components/ui/sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background dark:bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col md:ml-64">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </ProtectedRoute>
  )
}
