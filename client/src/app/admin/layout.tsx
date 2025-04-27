import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="h-14 border-b border-border bg-background flex items-center px-4 shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">Admin Portal</h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
