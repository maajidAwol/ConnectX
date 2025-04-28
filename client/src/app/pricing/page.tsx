import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PricingPage() {
  return (
    <div className="container py-10 space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
          Choose the plan that's right for your business. All plans include core features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {/* Starter Plan */}
        <Card className="flex flex-col border-muted">
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              2.5%
              <span className="ml-1 text-xl font-medium text-muted-foreground">per sale</span>
            </div>
            <CardDescription className="mt-4">Perfect for new businesses just getting started.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {[
                "Up to 100 products",
                "Basic analytics",
                "Standard support",
                "Payment processing",
                "Inventory management",
                "Mobile-responsive templates",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="h-4 w-4 text-[#02569B] mr-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button className="w-full bg-[#02569B] hover:bg-[#02569B]/90">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col relative border-[#02569B]">
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-[#02569B] text-white text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              1.9%
              <span className="ml-1 text-xl font-medium text-muted-foreground">per sale</span>
            </div>
            <CardDescription className="mt-4">For growing businesses with increased needs.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {[
                "Unlimited products",
                "Advanced analytics",
                "Priority support",
                "Lower transaction fees",
                "Custom branding",
                "API access",
                "Multiple user accounts",
                "Abandoned cart recovery",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="h-4 w-4 text-[#02569B] mr-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button className="w-full bg-[#02569B] hover:bg-[#02569B]/90">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="flex flex-col border-muted">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">Custom</div>
            <CardDescription className="mt-4">For large businesses with specific requirements.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {[
                "Everything in Pro",
                "Custom integration",
                "Dedicated account manager",
                "24/7 phone support",
                "Service level agreement",
                "Custom development",
                "On-premise deployment option",
                "Advanced security features",
                "Bulk operations",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="h-4 w-4 text-[#02569B] mr-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-[#02569B] text-[#02569B]">
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-[700px] mx-auto">
          Have questions about our pricing? Check out our FAQ or contact our sales team.
        </p>
        <div className="pt-4">
          <Link href="/docs">
            <Button variant="outline">View FAQ</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
