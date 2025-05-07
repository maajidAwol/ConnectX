import type React from "react"
import { MerchantSidebar } from "@/components/merchant-sidebar"
import { ClientHeader } from "@/components/client-header"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <ClientHeader title="Merchant Portal" />
          <div className="flex items-center gap-4">
            <UserProfileDropdown />
          </div>
        </div>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
