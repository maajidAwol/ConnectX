import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export default function MerchantManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Merchant Management</h2>
        <p className="text-muted-foreground">Review and approve merchant applications</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="under-review">Under Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing all applications</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Refresh
              </Button>
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {[
            // Pending merchants
            {
              id: "m1",
              name: "Artisan Crafts Co.",
              email: "contact@artisancrafts.example",
              date: "2023-04-15",
              status: "pending",
              category: "Handmade Goods",
              location: "Portland, OR",
            },
            {
              id: "m2",
              name: "Tech Gadgets Plus",
              email: "info@techgadgetsplus.example",
              date: "2023-04-14",
              status: "pending",
              category: "Electronics",
              location: "Austin, TX",
            },
            // Under review merchants
            {
              id: "m11",
              name: "Green Earth Organics",
              email: "contact@greenearthorganics.example",
              date: "2023-04-16",
              reviewStartDate: "2023-04-17",
              status: "under-review",
              category: "Organic Products",
              location: "Burlington, VT",
            },
            {
              id: "m12",
              name: "Digital Art Studio",
              email: "hello@digitalart.example",
              date: "2023-04-15",
              reviewStartDate: "2023-04-16",
              status: "under-review",
              category: "Digital Art & NFTs",
              location: "New York, NY",
            },
            // Approved merchants
            {
              id: "m6",
              name: "Gourmet Delights",
              email: "hello@gourmetdelights.example",
              date: "2023-04-10",
              approvedDate: "2023-04-11",
              status: "approved",
              category: "Food & Beverage",
              location: "Seattle, WA",
            },
            {
              id: "m7",
              name: "Fitness Gear Pro",
              email: "support@fitnessgear.example",
              date: "2023-04-09",
              approvedDate: "2023-04-10",
              status: "approved",
              category: "Sports & Fitness",
              location: "Boston, MA",
            },
            // Rejected merchants
            {
              id: "m9",
              name: "Fast Fashion Outlet",
              email: "sales@fastfashion.example",
              date: "2023-04-07",
              rejectedDate: "2023-04-08",
              status: "rejected",
              category: "Apparel",
              location: "Los Angeles, CA",
              reason: "Incomplete documentation",
            },
            {
              id: "m10",
              name: "Discount Electronics",
              email: "info@discountelectronics.example",
              date: "2023-04-06",
              rejectedDate: "2023-04-07",
              status: "rejected",
              category: "Electronics",
              location: "Houston, TX",
              reason: "Failed verification checks",
            },
          ].map((merchant) => (
            <Card key={merchant.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{merchant.name}</CardTitle>
                  {merchant.status === "pending" && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Pending Review</span>
                    </Badge>
                  )}
                  {merchant.status === "under-review" && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Under Review</span>
                    </Badge>
                  )}
                  {merchant.status === "approved" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Approved</span>
                    </Badge>
                  )}
                  {merchant.status === "rejected" && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      <span>Rejected</span>
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Applied on {merchant.date}
                  {merchant.reviewStartDate && ` • Review started on ${merchant.reviewStartDate}`}
                  {merchant.approvedDate && ` • Approved on ${merchant.approvedDate}`}
                  {merchant.rejectedDate && ` • Rejected on ${merchant.rejectedDate}`}
                  {` • ${merchant.category} • ${merchant.location}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                    <p className="text-sm">{merchant.email}</p>
                  </div>
                  <div>
                    {merchant.status === "rejected" ? (
                      <>
                        <h4 className="text-sm font-medium mb-2">Rejection Reason</h4>
                        <p className="text-sm">{merchant.reason}</p>
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm font-medium mb-2">Business Details</h4>
                        <p className="text-sm">Business Type: LLC</p>
                        <p className="text-sm">Tax ID: ••••••1234</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {(merchant.status === "pending" || merchant.status === "under-review") && (
                    <>
                      <Button variant="destructive" size="sm">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </>
                  )}
                  {merchant.status === "approved" && (
                    <Button variant="destructive" size="sm">
                      Revoke Approval
                    </Button>
                  )}
                  {merchant.status === "rejected" && <Button size="sm">Reconsider Application</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing 5 pending applications</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Refresh
              </Button>
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {[
            {
              id: "m1",
              name: "Artisan Crafts Co.",
              email: "contact@artisancrafts.example",
              date: "2023-04-15",
              status: "pending",
              category: "Handmade Goods",
              location: "Portland, OR",
            },
            {
              id: "m2",
              name: "Tech Gadgets Plus",
              email: "info@techgadgetsplus.example",
              date: "2023-04-14",
              status: "pending",
              category: "Electronics",
              location: "Austin, TX",
            },
            {
              id: "m3",
              name: "Organic Wellness",
              email: "hello@organicwellness.example",
              date: "2023-04-13",
              status: "pending",
              category: "Health & Wellness",
              location: "Denver, CO",
            },
            {
              id: "m4",
              name: "Vintage Treasures",
              email: "shop@vintagetreasures.example",
              date: "2023-04-12",
              status: "pending",
              category: "Antiques & Collectibles",
              location: "Chicago, IL",
            },
            {
              id: "m5",
              name: "Modern Home Decor",
              email: "sales@modernhomedecor.example",
              date: "2023-04-11",
              status: "pending",
              category: "Home & Garden",
              location: "Miami, FL",
            },
          ].map((merchant) => (
            <Card key={merchant.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{merchant.name}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Pending Review</span>
                  </Badge>
                </div>
                <CardDescription>
                  Applied on {merchant.date} • {merchant.category} • {merchant.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                    <p className="text-sm">{merchant.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Business Details</h4>
                    <p className="text-sm">Business Type: LLC</p>
                    <p className="text-sm">Tax ID: ••••••1234</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="destructive" size="sm">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="under-review" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing 3 applications under review</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Refresh
              </Button>
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {[
            {
              id: "m11",
              name: "Green Earth Organics",
              email: "contact@greenearthorganics.example",
              date: "2023-04-16",
              reviewStartDate: "2023-04-17",
              status: "under-review",
              category: "Organic Products",
              location: "Burlington, VT",
            },
            {
              id: "m12",
              name: "Digital Art Studio",
              email: "hello@digitalart.example",
              date: "2023-04-15",
              reviewStartDate: "2023-04-16",
              status: "under-review",
              category: "Digital Art & NFTs",
              location: "New York, NY",
            },
            {
              id: "m13",
              name: "Sustainable Fashion",
              email: "info@sustainablefashion.example",
              date: "2023-04-14",
              reviewStartDate: "2023-04-15",
              status: "under-review",
              category: "Eco-friendly Apparel",
              location: "San Francisco, CA",
            },
          ].map((merchant) => (
            <Card key={merchant.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{merchant.name}</CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Under Review</span>
                  </Badge>
                </div>
                <CardDescription>
                  Applied on {merchant.date} • Review started on {merchant.reviewStartDate} • {merchant.category} •{" "}
                  {merchant.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                    <p className="text-sm">{merchant.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Business Details</h4>
                    <p className="text-sm">Business Type: LLC</p>
                    <p className="text-sm">Tax ID: ••••••1234</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="destructive" size="sm">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing 3 approved applications</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Refresh
              </Button>
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {[
            {
              id: "m6",
              name: "Gourmet Delights",
              email: "hello@gourmetdelights.example",
              date: "2023-04-10",
              approvedDate: "2023-04-11",
              status: "approved",
              category: "Food & Beverage",
              location: "Seattle, WA",
            },
            {
              id: "m7",
              name: "Fitness Gear Pro",
              email: "support@fitnessgear.example",
              date: "2023-04-09",
              approvedDate: "2023-04-10",
              status: "approved",
              category: "Sports & Fitness",
              location: "Boston, MA",
            },
            {
              id: "m8",
              name: "Pet Paradise",
              email: "care@petparadise.example",
              date: "2023-04-08",
              approvedDate: "2023-04-09",
              status: "approved",
              category: "Pet Supplies",
              location: "San Diego, CA",
            },
          ].map((merchant) => (
            <Card key={merchant.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{merchant.name}</CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Approved</span>
                  </Badge>
                </div>
                <CardDescription>
                  Applied on {merchant.date} • Approved on {merchant.approvedDate} • {merchant.category} •{" "}
                  {merchant.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                    <p className="text-sm">{merchant.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Business Details</h4>
                    <p className="text-sm">Business Type: LLC</p>
                    <p className="text-sm">Tax ID: ••••••1234</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="destructive" size="sm">
                    Revoke Approval
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing 2 rejected applications</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Refresh
              </Button>
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {[
            {
              id: "m9",
              name: "Fast Fashion Outlet",
              email: "sales@fastfashion.example",
              date: "2023-04-07",
              rejectedDate: "2023-04-08",
              status: "rejected",
              category: "Apparel",
              location: "Los Angeles, CA",
              reason: "Incomplete documentation",
            },
            {
              id: "m10",
              name: "Discount Electronics",
              email: "info@discountelectronics.example",
              date: "2023-04-06",
              rejectedDate: "2023-04-07",
              status: "rejected",
              category: "Electronics",
              location: "Houston, TX",
              reason: "Failed verification checks",
            },
          ].map((merchant) => (
            <Card key={merchant.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{merchant.name}</CardTitle>
                  <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    <span>Rejected</span>
                  </Badge>
                </div>
                <CardDescription>
                  Applied on {merchant.date} • Rejected on {merchant.rejectedDate} • {merchant.category} •{" "}
                  {merchant.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                    <p className="text-sm">{merchant.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Rejection Reason</h4>
                    <p className="text-sm">{merchant.reason}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">Reconsider Application</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
