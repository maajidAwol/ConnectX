import type React from "react"
import Link from "next/link"
import { ChevronRight, Menu } from "lucide-react"
import { DocSidebarNav } from "@/components/doc-sidebar-nav"
import { docsConfig } from "@/config/docs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Mobile sidebar trigger */}
        <div className="sticky top-14 z-30 flex h-14 items-center md:hidden border-b w-full bg-background">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px] pt-10">
              <DocSidebarNav items={docsConfig.sidebarNav} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">Docs</div>
            <ChevronRight className="h-4 w-4" />
            <div className="font-medium text-foreground">Introduction</div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block overflow-y-auto py-6 pr-2 md:py-10">
          <DocSidebarNav items={docsConfig.sidebarNav} />
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-10">
          <div className="mx-auto w-full min-w-0 max-w-4xl">
            <div className="mb-4 hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">Docs</div>
              <ChevronRight className="h-4 w-4" />
              <div className="font-medium text-foreground">Introduction</div>
            </div>
            <div className="space-y-2">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Documentation</h1>
              <p className="text-lg text-muted-foreground">Learn how to integrate ConnectX into your application.</p>
            </div>
            <div className="pb-12 pt-8">{children}</div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ConnectX. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-[#02569B] transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-[#02569B] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-[#02569B] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
