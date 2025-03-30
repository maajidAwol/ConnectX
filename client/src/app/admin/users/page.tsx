"use client"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import {
  LayoutDashboard,
  Building2,
  Code2,
  Users,
  BarChart3,
  Activity,
  ShieldAlert,
  Settings,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "System Administrator",
    lastActive: "2 days ago",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Platform Manager",
    lastActive: "5 hours ago",
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Support Administrator",
    lastActive: "1 week ago",
    status: "Inactive",
  },
]

export default function AdminUsersPage() {
  return (
    <DashboardLayout
      title="User Management"
      description="Manage system administrators and their roles"
      role="admin"
      navigation={[
        {
          title: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Merchants",
          href: "/admin/merchants",
          icon: Building2,
          badge: 3,
        },
        {
          title: "Developers",
          href: "/admin/developers",
          icon: Code2,
        },
        {
          title: "Users",
          href: "/admin/users",
          icon: Users,
        },
        {
          title: "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
        },
        {
          title: "System Health",
          href: "/admin/system-health",
          icon: Activity,
        },
        {
          title: "Security",
          href: "/admin/security",
          icon: ShieldAlert,
        },
        {
          title: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
        {
          title: "Help",
          href: "/admin/help",
          icon: HelpCircle,
        },
      ]}
    >
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Link href="/admin/add-admin">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

