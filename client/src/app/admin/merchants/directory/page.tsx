import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, ExternalLink, Filter, MoreHorizontal, Search, ShieldCheck, User } from "lucide-react"
import { verificationRequests } from "@/lib/data"

export default function MerchantManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Merchant Management</h2>
        <p className="text-muted-foreground">Manage merchant accounts and verification requests</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search merchants..." className="pl-8 w-full" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="all">All Merchants</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="verification" className="space-y-4">
        <TabsList>
          <TabsTrigger value="merchants">All Merchants</TabsTrigger>
          <TabsTrigger value="verification">Verification Requests</TabsTrigger>
          {/* <TabsTrigger value="accounts">Account Management</TabsTrigger> */}
        </TabsList>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Verification Requests</CardTitle>
              <CardDescription>Review and approve merchant verification requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Merchant</div>
                  <div className="col-span-2">Request ID</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Documents</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {verificationRequests.map((request) => (
                    <div key={request.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-medium">{request.merchantName}</div>
                          <div className="text-sm text-muted-foreground">ID: {request.merchantId}</div>
                        </div>
                      </div>
                      <div className="col-span-2">{request.id}</div>
                      <div className="col-span-2">{request.submittedDate}</div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            request.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : request.status === "Under Review"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : request.status === "Approved"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          {request.documents.filter((doc) => doc.status === "Verified").length} /{" "}
                          {request.documents.length}
                          <span className="text-sm text-muted-foreground">verified</span>
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/merchants/verification/${request.id}`}>
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchants">
          <Card>
            <CardHeader>
              <CardTitle>All Merchants</CardTitle>
              <CardDescription>View and manage all merchant accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Merchant</div>
                  <div className="col-span-2">Business Type</div>
                  <div className="col-span-2">Joined</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Revenue</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {/* Sample merchant data - in a real app, this would be fetched from an API */}
                  {[
                    {
                      id: 1,
                      name: "TechGadgets Store",
                      email: "contact@techgadgets.com",
                      businessType: "Corporation",
                      joined: "Jan 15, 2023",
                      status: "Verified",
                      revenue: "$42,582",
                    },
                    {
                      id: 2,
                      name: "Fashion Forward",
                      email: "info@fashionforward.com",
                      businessType: "LLC",
                      joined: "Mar 22, 2023",
                      status: "Verified",
                      revenue: "$38,103",
                    },
                    {
                      id: 3,
                      name: "Example Merchant",
                      email: "merchant@example.com",
                      businessType: "Sole Proprietorship",
                      joined: "Apr 10, 2023",
                      status: "Unverified",
                      revenue: "$0",
                    },
                    {
                      id: 4,
                      name: "New Merchant LLC",
                      email: "contact@newmerchant.com",
                      businessType: "LLC",
                      joined: "Apr 15, 2023",
                      status: "Under Review",
                      revenue: "$0",
                    },
                  ].map((merchant) => (
                    <div key={merchant.id} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-medium">{merchant.name}</div>
                          <div className="text-sm text-muted-foreground">{merchant.email}</div>
                        </div>
                      </div>
                      <div className="col-span-2">{merchant.businessType}</div>
                      <div className="col-span-2">{merchant.joined}</div>
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            merchant.status === "Unverified"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : merchant.status === "Under Review"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {merchant.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">{merchant.revenue}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage merchant account settings and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-semibold mb-2">Account Approval Workflow</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure the merchant approval process and verification requirements
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Automatic Approval</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Automatically approve merchants that meet basic requirements
                      </p>
                      <div className="flex items-center mt-2">
                        <input type="checkbox" id="auto-approve" className="mr-2" />
                        <label htmlFor="auto-approve" className="text-sm">
                          Enable automatic approval
                        </label>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-amber-600" />
                        <span className="font-medium">Review Period</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set the maximum time for merchant verification review
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Input type="number" defaultValue={3} className="w-20" />
                        <span className="text-sm">business days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-semibold mb-2">Required Verification Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure which documents are required for merchant verification
                  </p>
                  <div className="space-y-2">
                    {[
                      "Business Registration Certificate",
                      "Tax Identification Number (TIN)",
                      "Bank Account Verification",
                      "ID of Business Owner/Representative",
                    ].map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                          <span>{doc}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id={`required-${index}`} defaultChecked className="mr-1" />
                          <label htmlFor={`required-${index}`} className="text-sm">
                            Required
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4" variant="outline">
                    Save Requirements
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
