import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeatureToggles() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Feature Toggles</h2>
        <p className="text-muted-foreground">Manage platform feature availability</p>
      </div>

      <Tabs defaultValue="merchant" className="space-y-4">
        <TabsList>
          <TabsTrigger value="merchant">Merchant Features</TabsTrigger>
          <TabsTrigger value="customer">Customer Features</TabsTrigger>
          <TabsTrigger value="platform">Platform Features</TabsTrigger>
        </TabsList>

        <TabsContent value="merchant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Features</CardTitle>
              <CardDescription>Toggle features available to merchants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: "advanced-analytics",
                  name: "Advanced Analytics",
                  description: "Enable advanced analytics dashboard for merchants",
                  enabled: true,
                  beta: false,
                },
                {
                  id: "bulk-product-import",
                  name: "Bulk Product Import",
                  description: "Allow merchants to import products in bulk via CSV",
                  enabled: true,
                  beta: false,
                },
                {
                  id: "api-access",
                  name: "API Access",
                  description: "Allow merchants to access the platform API",
                  enabled: true,
                  beta: false,
                },
                {
                  id: "custom-domains",
                  name: "Custom Domains",
                  description: "Allow merchants to use custom domains for their storefronts",
                  enabled: true,
                  beta: false,
                },
                {
                  id: "ai-product-descriptions",
                  name: "AI Product Descriptions",
                  description: "Enable AI-generated product descriptions",
                  enabled: true,
                  beta: true,
                },
                {
                  id: "subscription-billing",
                  name: "Subscription Billing",
                  description: "Enable subscription billing for merchants",
                  enabled: false,
                  beta: true,
                },
              ].map((feature) => (
                <div key={feature.id} className="flex items-center justify-between space-x-2 border-b pb-4">
                  <div className="space-y-0.5">
                    <Label htmlFor={feature.id} className="text-base">
                      {feature.name}
                      {feature.beta && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">BETA</span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch id={feature.id} checked={feature.enabled} />
                </div>
              ))}

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Features</CardTitle>
              <CardDescription>Toggle features available to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: "wishlist",
                  name: "Wishlists",
                  description: "Allow customers to create and manage wishlists",
                  enabled: true,
                  beta: false,
                },
                {
                  id: "reviews",
                  name: "Product Reviews",
                  description: "Allow customers to leave product reviews",
                  enabled: true,
                  beta: false,
                },
                {
                  id: "one-click-checkout",
                  name: "One-Click Checkout",
                  description: "Enable one-click checkout for returning customers",
                  enabled: true,
                  beta: false,
                },
                {
                  id: "ar-product-preview",
                  name: "AR Product Preview",
                  description: "Enable augmented reality product previews",
                  enabled: false,
                  beta: true,
                },
              ].map((feature) => (
                <div key={feature.id} className="flex items-center justify-between space-x-2 border-b pb-4">
                  <div className="space-y-0.5">
                    <Label htmlFor={feature.id} className="text-base">
                      {feature.name}
                      {feature.beta && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">BETA</span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch id={feature.id} checked={feature.enabled} />
                </div>
              ))}

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>Toggle platform-wide features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: "maintenance-mode",
                  name: "Maintenance Mode",
                  description: "Put the platform in maintenance mode",
                  enabled: false,
                  beta: false,
                  critical: true,
                },
                {
                  id: "new-merchant-registration",
                  name: "New Merchant Registration",
                  description: "Allow new merchants to register",
                  enabled: true,
                  beta: false,
                  critical: false,
                },
                {
                  id: "automatic-payouts",
                  name: "Automatic Payouts",
                  description: "Process merchant payouts automatically",
                  enabled: true,
                  beta: false,
                  critical: true,
                },
                {
                  id: "marketplace",
                  name: "Marketplace",
                  description: "Enable the platform marketplace",
                  enabled: true,
                  beta: false,
                  critical: false,
                },
              ].map((feature) => (
                <div key={feature.id} className="flex items-center justify-between space-x-2 border-b pb-4">
                  <div className="space-y-0.5">
                    <Label htmlFor={feature.id} className="text-base">
                      {feature.name}
                      {feature.critical && (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">CRITICAL</span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch id={feature.id} checked={feature.enabled} />
                </div>
              ))}

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
