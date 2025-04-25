import type React from "react"
import { MerchantSidebar } from "@/components/merchant-sidebar"

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="h-14 border-b bg-white flex items-center px-4">
          <h1 className="text-lg font-semibold">Merchant Portal</h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
