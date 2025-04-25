"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for marketplace items
const marketplaceItems = [
  {
    id: "1",
    title: "Payment Gateway",
    description: "Process payments securely with our payment gateway integration",
    category: "Payments",
    price: "Free",
    publisher: "ConnectX",
  },
  {
    id: "2",
    title: "Shipping Calculator",
    description: "Calculate shipping rates in real-time based on customer location",
    category: "Shipping",
    price: "$9.99/month",
    publisher: "ShipFast",
  },
  {
    id: "3",
    title: "Tax Calculator",
    description: "Automatically calculate taxes for all jurisdictions",
    category: "Finance",
    price: "$4.99/month",
    publisher: "TaxPro",
  },
  {
    id: "4",
    title: "Email Marketing",
    description: "Send automated emails to your customers",
    category: "Marketing",
    price: "$19.99/month",
    publisher: "EmailMaster",
  },
]

export function MarketplaceList() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Product Marketplace</h3>
        <p className="text-sm text-muted-foreground">Discover and install integrations to enhance your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketplaceItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.title}</CardTitle>
                <Badge>{item.category}</Badge>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Publisher: {item.publisher}</p>
              <p className="text-sm font-medium mt-1">{item.price}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Install</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
