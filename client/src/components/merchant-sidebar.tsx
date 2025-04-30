"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  Box,
  ChevronDown,
  Code,
  Home,
  LogOut,
  Menu,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"

interface SidebarProps {
  className?: string
}

export function MerchantSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const logout = useAuthStore((state) => state.logout)

  const routes = [
    {
      title: "Dashboard",
      href: "/merchant",
      icon: Home,
      isActive: pathname === "/merchant",
    },
    {
      title: "Team Management",
      href: "/merchant/team",
      icon: Users,
      isActive: pathname.startsWith("/merchant/team"),
    },
    {
      title: "Business Profile",
      href: "/merchant/profile",
      icon: Settings,
      isActive: pathname.startsWith("/merchant/profile"),
    },
    {
      title: "Product Management",
      href: "/merchant/products",
      icon: Package,
      isActive: pathname.startsWith("/merchant/products"),
      submenu: [
        { title: "All Products", href: "/merchant/products" },
        { title: "Add Product", href: "/merchant/products/add" },
        { title: "Categories", href: "/merchant/products/categories" },
        // { title: "Promotions", href: "/merchant/products/promotions" },
      ],
    },
    {
      title: "Order Management",
      href: "/merchant/orders",
      icon: ShoppingCart,
      isActive: pathname.startsWith("/merchant/orders"),
      submenu: [
        { title: "All Orders", href: "/merchant/orders" },
        { title: "Returns & Refunds", href: "/merchant/orders/returns" },
        { title: "Customers", href: "/merchant/orders/customers" },
        // { title: "Email Templates", href: "/merchant/orders/emails" },
      ],
    },
    {
      title: "Analytics",
      href: "/merchant/analytics",
      icon: BarChart2,
      isActive: pathname.startsWith("/merchant/analytics"),
      // submenu: [
      //   { title: "Sales Performance", href: "/merchant/analytics" },
      //   { title: "Channel Insights", href: "/merchant/analytics/channels" },
      //   { title: "Customer Behavior", href: "/merchant/analytics/customers" },
      //   { title: "Inventory Trends", href: "/merchant/analytics/inventory" },
      // ],
    },
    // {
    //   title: "Frontend Resources",
    //   href: "/merchant/frontend",
    //   icon: Palette,
    //   isActive: pathname.startsWith("/merchant/frontend"),
    // },
    {
      title: "API Key",
      href: "/merchant/api-key",
      icon: Code,
      isActive: pathname.startsWith("/merchant/api-key"),
      // submenu: [
      //   { title: "Product Marketplace", href: "/merchant/developer-tools" },
      //   { title: "Integration Dashboard", href: "/merchant/developer-tools/integrations" },
      //   { title: "API Keys", href: "/merchant/developer-tools/api-keys" },
      // ],
    },
  ]

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleSubmenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 h-full">
          <div className="flex h-full flex-col bg-background border-r border-border">
            <div className="flex h-14 items-center border-b border-border px-4">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Box className="h-5 w-5 text-primary" />
                <span>ConnectX Merchant</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <div key={route.title}>
                    {route.submenu ? (
                      <>
                        <button
                          onClick={() => toggleSubmenu(route.title)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                            route.isActive 
                              ? "bg-primary/10 text-primary" 
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <route.icon className="h-5 w-5" />
                            {route.title}
                          </div>
                          <ChevronDown
                            className={cn("h-4 w-4 transition-transform", openMenus[route.title] ? "rotate-180" : "")}
                          />
                        </button>
                        {openMenus[route.title] && (
                          <div className="ml-6 mt-1 grid gap-1 pl-3 border-l border-border">
                            {route.submenu.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "rounded-md px-3 py-2 text-sm",
                                  pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={route.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                          route.isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        <route.icon className="h-5 w-5" />
                        {route.title}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="border-t border-border p-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden fixed top-0 left-0 h-screen w-64 flex-col border-r border-border bg-background md:flex z-10", className)}>
        <div className="flex h-14 items-center border-b border-border px-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Box className="h-5 w-5 text-primary" />
            <span>ConnectX Merchant</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <div key={route.title}>
                {route.submenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(route.title)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                        route.isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <route.icon className="h-5 w-5" />
                        {route.title}
                      </div>
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", openMenus[route.title] ? "rotate-180" : "")}
                      />
                    </button>
                    {openMenus[route.title] && (
                      <div className="ml-6 mt-1 grid gap-1 pl-3 border-l border-border">
                        {route.submenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "rounded-md px-3 py-2 text-sm",
                              pathname === item.href 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      route.isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="border-t border-border p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  )
}
