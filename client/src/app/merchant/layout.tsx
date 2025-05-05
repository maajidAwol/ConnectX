import type React from "react"
import { MerchantSidebar } from "@/components/merchant-sidebar"
import { ClientHeader } from "@/components/client-header"

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <ClientHeader title="Merchant Portal" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
