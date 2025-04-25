"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, ChevronDown, Database, Home, Menu, Settings, Shield, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
      isActive: pathname === "/admin",
    },
    {
      title: "Merchant Management",
      href: "/admin/merchants",
      icon: Users,
      isActive: pathname.startsWith("/admin/merchants"),
      submenu: [
        { title: "Merchant Directory", href: "/admin/merchants" },
        { title: "Approval Workflow", href: "/admin/merchants/approval" },
        // { title: "Account Management", href: "/admin/merchants/accounts" },
      ],
    },
    // {
    //   title: "Developer Oversight",
    //   href: "/admin/developers",
    //   icon: Shield,
    //   isActive: pathname.startsWith("/admin/developers"),
    //   submenu: [
    //     { title: "Developer Directory", href: "/admin/developers" },
    //     { title: "API Rate Limits", href: "/admin/developers/api-limits" },
    //     { title: "Product Linkage", href: "/admin/developers/products" },
    //   ],
    // },
    // {
    //   title: "Platform Settings",
    //   href: "/admin/settings",
    //   icon: Settings,
    //   isActive: pathname.startsWith("/admin/settings"),
    //   submenu: [
    //     { title: "Global Config", href: "/admin/settings" },
    //     { title: "Feature Toggles", href: "/admin/settings/features" },
    //     { title: "Notifications", href: "/admin/settings/notifications" },
    //   ],
    // },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart2,
      isActive: pathname.startsWith("/admin/analytics"),
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
          <div className="flex h-full flex-col bg-white">
            <div className="flex h-14 items-center border-b px-4">
              <div className="flex items-center gap-2 font-semibold">
                <Database className="h-5 w-5 text-blue-600" />
                <span>ConnectX Admin</span>
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
                            route.isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100",
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
                          <div className="ml-6 mt-1 grid gap-1 pl-3 border-l border-gray-200">
                            {route.submenu.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "rounded-md px-3 py-2 text-sm",
                                  pathname === item.href
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-100",
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
                          route.isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100",
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
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-medium">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@connectx.com</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden fixed top-0 left-0 h-screen w-64 flex-col border-r bg-white md:flex z-10", className)}>
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Database className="h-5 w-5 text-blue-600" />
            <span>ConnectX Admin</span>
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
                        route.isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100",
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
                      <div className="ml-6 mt-1 grid gap-1 pl-3 border-l border-gray-200">
                        {route.submenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "rounded-md px-3 py-2 text-sm",
                              pathname === item.href ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100",
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
                      route.isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100",
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
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@connectx.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
