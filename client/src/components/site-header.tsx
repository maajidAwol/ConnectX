    "use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { DocSearch } from "@/components/docs/doc-search"
import { Suspense } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  const isDocsPage = pathname?.startsWith("/docs")

  const navItems = [
    { href: "/docs", label: "Docs" },
    { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Logo />
          <nav className="ml-6 flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                    ? "text-foreground font-semibold"
                    : "text-foreground/60",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isDocsPage && (
            <div className="hidden md:block">
              <Suspense>
                <DocSearch />
              </Suspense>
            </div>
          )}
          <nav className="flex items-center">
            <ModeToggle />
            <Link href="/login" className="ml-4">
              <Button variant="ghost" className="text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="ml-2">
              <Button className="bg-gradient-to-r from-[#02569B] to-[#0288d1] hover:opacity-90 text-sm">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
