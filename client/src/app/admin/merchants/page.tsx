"use client";

import { useState } from "react";
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
} from '@/components/ui/table'
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
  MoreHorizontal,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Mock data with additional pending merchant
const initialMerchants = [
  {
    id: 1,
    name: "Acme Corp",
    email: "acme@example.com",
    products: 128,
    revenue: "$45,289",
    joined: "Jan 12, 2023",
    status: "Active",
    isSuspended: false,
    registrationDetails: { businessType: "Retail", documents: "Verified" },
  },
  {
    id: 2,
    name: "Global Gadgets",
    email: "global@example.com",
    products: 256,
    revenue: "$98,546",
    joined: "Mar 5, 2022",
    status: "Active",
    isSuspended: false,
    registrationDetails: { businessType: "Electronics", documents: "Verified" },
  },
  {
    id: 3,
    name: "Tech Innovations",
    email: "tech@example.com",
    products: 0,
    revenue: "$0",
    joined: "Today",
    status: "Pending",
    isSuspended: false,
    registrationDetails: { businessType: "Tech", documents: "Pending Verification" },
  },
  {
    id: 4,
    name: "Future Tech",
    email: "future@example.com",
    products: 45,
    revenue: "$12,300",
    joined: "Feb 10, 2024",
    status: "Suspended",
    isSuspended: true,
    registrationDetails: { businessType: "Tech", documents: "Verified" },
  },
  {
    id: 5,
    name: "New Vendor Co",
    email: "newvendor@example.com",
    products: 0,
    revenue: "$0",
    joined: "Apr 01, 2025",
    status: "Pending",
    isSuspended: false,
    registrationDetails: { businessType: "Wholesale", documents: "Pending Verification" },
  },
];

export default function AdminMerchantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [merchants, setMerchants] = useState(initialMerchants);
  const [selectedMerchants, setSelectedMerchants] = useState<number[]>([]);

  // Filter pending merchants for approval section
  const pendingMerchants = merchants.filter((m) => m.status === "Pending");

  // Filter main merchant table
  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.name.toLowerCase().includes(search.toLowerCase()) ||
      merchant.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || merchant.status === statusFilter;
    return matchesSearch && matchesStatus && merchant.status !== "Pending"; // Exclude pending from main table
  });

  // Handle merchant approval
  const handleApprove = (id: number) => {
    const merchant = merchants.find((m) => m.id === id);
    if (merchant && merchant.status === "Pending") {
      setMerchants((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, status: "Active", registrationDetails: { ...m.registrationDetails, documents: "Verified" } }
            : m
        )
      );
      toast({
        title: "Merchant Approved",
        description: `${merchant.name} has been approved after review.`,
      });
    }
  };

  // Handle merchant rejection
  const handleReject = (id: number) => {
    const merchant = merchants.find((m) => m.id === id);
    if (merchant && merchant.status === "Pending") {
      setMerchants((prev) => prev.filter((m) => m.id !== id));
      toast({
        title: "Merchant Rejected",
        description: `${merchant.name} has been rejected after review.`,
      });
    }
  };

  // Handle suspend/restore
  const handleToggleSuspend = (id: number) => {
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isSuspended: !m.isSuspended, status: m.isSuspended ? "Active" : "Suspended" } : m
      )
    );
    toast({
      title: `Merchant ${merchants.find((m) => m.id === id)?.isSuspended ? "Restored" : "Suspended"}`,
      description: `The merchant has been ${merchants.find((m) => m.id === id)?.isSuspended ? "restored" : "suspended"}.`,
    });
  };

  // Handle bulk operations
  const handleBulkAction = (action: "suspend" | "restore" | "delete") => {
    if (selectedMerchants.length === 0) {
      toast({ title: "No Selection", description: "Please select at least one merchant.", variant: "destructive" });
      return;
    }

    setMerchants((prev) =>
      prev.map((m) => {
        if (selectedMerchants.includes(m.id)) {
          switch (action) {
            case "suspend":
              return { ...m, isSuspended: true, status: "Suspended" };
            case "restore":
              return { ...m, isSuspended: false, status: "Active" };
            case "delete":
              return null;
            default:
              return m;
          }
        }
        return m;
      }).filter((m) => m !== null) as typeof prev
    );

    setSelectedMerchants([]);
    toast({
      title: `Bulk ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      description: `${selectedMerchants.length} merchant(s) have been ${action}ed.`,
    });
  };

  // Handle checkbox selection
  const toggleSelectMerchant = (id: number) => {
    setSelectedMerchants((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  // Select all merchants
  const toggleSelectAll = () => {
    if (selectedMerchants.length === filteredMerchants.length) {
      setSelectedMerchants([]);
    } else {
      setSelectedMerchants(filteredMerchants.map((m) => m.id));
    }
  };

  return (
    <DashboardLayout
      title="Merchant Management"
      description="View and manage all merchants on the platform"
      role="admin"
      navigation={navigation}
    >
      <div className="container mx-auto py-6">
        {/* Pending Merchants Section */}
        {pendingMerchants.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Merchant Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingMerchants.map((merchant) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">{merchant.name}</TableCell>
                      <TableCell>{merchant.email}</TableCell>
                      <TableCell>{merchant.registrationDetails.businessType}</TableCell>
                      <TableCell>{merchant.registrationDetails.documents}</TableCell>
                      <TableCell>{merchant.joined}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(merchant.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(merchant.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Main Merchant Directory */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merchants</CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <Input
                type="search"
                placeholder="Search merchants..."
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
              {selectedMerchants.length > 0 && (
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button variant="outline" onClick={() => handleBulkAction("suspend")}>
                    Suspend Selected
                  </Button>
                  <Button variant="outline" onClick={() => handleBulkAction("restore")}>
                    Restore Selected
                  </Button>
                  <Button variant="destructive" onClick={() => handleBulkAction("delete")}>
                    Delete Selected
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedMerchants.length === filteredMerchants.length && filteredMerchants.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedMerchants.includes(merchant.id)}
                        onCheckedChange={() => toggleSelectMerchant(merchant.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{merchant.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          merchant.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                        }
                      >
                        {merchant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{merchant.products}</TableCell>
                    <TableCell>{merchant.revenue}</TableCell>
                    <TableCell>{merchant.joined}</TableCell>
                    <TableCell>{merchant.registrationDetails.businessType}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleSuspend(merchant.id)}>
                            {merchant.isSuspended ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Restore
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Suspend
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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