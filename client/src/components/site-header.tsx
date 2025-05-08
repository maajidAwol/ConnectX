"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { DocSearch } from "@/components/docs/doc-search"
import { Suspense, useState } from "react"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()
  const isDocsPage = pathname?.startsWith("/docs")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/docs", label: "Docs" },
    { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
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

        <div className="flex items-center space-x-4">
          {isDocsPage && (
            <div className="hidden md:block">
              <Suspense>
                <DocSearch />
              </Suspense>
            </div>
          )}
          <div className="hidden md:flex items-center">
            <ModeToggle />
            <Link href="/login" className="ml-4">
              <Button variant="ghost" className="text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="ml-2">
              <Button className="bg-gradient-to-r from-[#02569B] to-[#0288d1] hover:opacity-90 text-sm">Sign Up</Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            name="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5"/>}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between pt-4 border-t">
              <ModeToggle />
              <div className="flex space-x-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="bg-gradient-to-r from-[#02569B] to-[#0288d1] hover:opacity-90 text-sm" name="Sign Up">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
