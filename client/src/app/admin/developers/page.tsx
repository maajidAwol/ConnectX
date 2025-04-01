"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Code2,
  HelpCircle,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Users,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react"; // Replaced Edit with CheckCircle and XCircle for suspend/restore
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Developer interface
interface Developer {
  id: number;
  name: string;
  email: string;
  apiKey: string;
  apiCalls: number;
  rateLimit: number;
  integrations: {
    merchantId: number;
    merchantName: string;
    productCount: number;
  }[];
  status: "Active" | "Suspended";
}

// Navigation data (unchanged)
const navigation = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Merchants", href: "/admin/merchants", icon: Building2, badge: 3 },
  { title: "Developers", href: "/admin/developers", icon: Code2 },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "System Health", href: "/admin/system-health", icon: Activity },
  { title: "Security", href: "/admin/security", icon: ShieldAlert },
  { title: "Settings", href: "/admin/settings", icon: Settings },
  { title: "Help", href: "/admin/help", icon: HelpCircle },
];

// Mock JSON data for developers with type annotation
const initialDevelopers: Developer[] = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    apiKey: "abc123",
    apiCalls: 1500,
    rateLimit: 2000,
    integrations: [
      { merchantId: 1, merchantName: "Acme Corp", productCount: 50 },
      { merchantId: 2, merchantName: "Global Gadgets", productCount: 30 },
    ],
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    apiKey: "xyz789",
    apiCalls: 3000,
    rateLimit: 5000,
    integrations: [{ merchantId: 2, merchantName: "Global Gadgets", productCount: 100 }],
    status: "Active",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    apiKey: "def456",
    apiCalls: 800,
    rateLimit: 1000,
    integrations: [],
    status: "Active",
  },
];

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>(() => {
    const storedDevelopers = localStorage.getItem("developers");
    return storedDevelopers ? JSON.parse(storedDevelopers) : initialDevelopers;
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Save developers to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("developers", JSON.stringify(developers));
  }, [developers]);

  // Filter developers
  const filteredDevelopers = developers.filter((developer: Developer) => {
    const matchesSearch =
      developer.name.toLowerCase().includes(search.toLowerCase()) ||
      developer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || developer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle rate limit update
  const handleUpdateRateLimit = (id: number, newLimit: number) => {
    setDevelopers((prev: Developer[]) =>
      prev.map((dev: Developer) =>
        dev.id === id ? { ...dev, rateLimit: newLimit } : dev
      )
    );
    toast({
      title: "Rate Limit Updated",
      description: `Rate limit for ${developers.find((d) => d.id === id)?.name} set to ${newLimit} calls/day.`,
    });
  };

  // Handle suspend/restore developer
  const handleToggleSuspend = (id: number) => {
    setDevelopers((prev: Developer[]) =>
      prev.map((dev: Developer) =>
        dev.id === id
          ? { ...dev, status: dev.status === "Active" ? "Suspended" : "Active" }
          : dev
      )
    );
    const developer = developers.find((d) => d.id === id);
    toast({
      title: `Developer ${developer?.status === "Active" ? "Suspended" : "Restored"}`,
      description: `${developer?.name} has been ${developer?.status === "Active" ? "suspended" : "restored"}.`,
    });
  };

  return (
    <DashboardLayout
      title="Developer Oversight"
      description="Manage registered developers and their API usage"
      role="admin"
      navigation={navigation}
    >
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Developers</CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <Input
                type="search"
                placeholder="Search developers..."
                className="w-full sm:w-64 rounded-md border bg-background pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-black">
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Developer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>API Calls</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Integrations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevelopers.map((developer: Developer) => (
                  <TableRow key={developer.id}>
                    <TableCell className="font-medium">{developer.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          developer.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                        }
                      >
                        {developer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{developer.apiCalls}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={developer.rateLimit}
                          onChange={(e) =>
                            handleUpdateRateLimit(developer.id, parseInt(e.target.value) || 0)
                          }
                          className="w-24"
                        />
                        <span>calls/day</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {developer.integrations.length > 0
                        ? developer.integrations.map((int) => int.merchantName).join(", ")
                        : "None"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleSuspend(developer.id)}
                      >
                        {developer.status === "Active" ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
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
  );
}