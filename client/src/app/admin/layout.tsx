import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ClientHeader } from "@/components/client-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <ClientHeader title="Admin Portal" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
