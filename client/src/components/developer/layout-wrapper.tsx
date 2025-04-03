"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import {
  LayoutDashboard,
  Compass,
  Code,
  Terminal,
  FileCode,
  ShieldCheck,
  Settings,
  HelpCircle,
  BarChart3,
  Key
} from "lucide-react"

const navigation = [
  {
    title: "Dashboard",
    href: "/developer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    href: "/developer/marketplace",
    icon: Compass,
  },
  {
    title: "API Explorer",
    href: "/developer/api-explorer",
    icon: Terminal,
  },
  {
    title: "Projects",
    href: "/developer/projects",
    icon: FileCode,
  },
  {
    title: "API Keys",
    href: "/developer/api-keys",
    icon: Key,
  },
  {
    title: "Analytics",
    href: "/developer/analytics",
    icon: BarChart3,
  },
  {
    title: "Security",
    href: "/developer/security",
    icon: ShieldCheck,
  },
  {
    title: "Settings",
    href: "/developer/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/developer/help",
    icon: HelpCircle,
  },
]

export function DeveloperLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout role="developer" navigation={navigation}>
      {children}
    </DashboardLayout>
  )
} 