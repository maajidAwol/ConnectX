import Link from "next/link"
import { Database, Lock, Package, ShoppingCart, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PartnerScroll } from "@/components/partner-scroll"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { ProcessSteps } from "@/components/process-steps"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                    <span className="font-medium text-[#02569B]">v1.0 Beta</span>
                    <span className="ml-2 rounded-md bg-gradient-to-r from-emerald-400 to-green-500 px-1.5 py-0.5 text-xs text-white">
                      New
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    The E-Commerce Backend That Powers Your Growth
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    ConnectX is a centralized, multi-tenant framework that democratizes e-commerce for entrepreneurs,
                    startups, and students. Focus on your brand while we handle the backend complexity.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-gradient-to-r from-[#02569B] to-[#0288d1] hover:opacity-90 text-white h-11">
                    Get Started Free
                  </Button>
                  <Link href="/docs" className="">
                    <Button variant="outline" className="border-[#02569B] text-[#02569B] hover:bg-[#02569B]/10 h-11 w-full">
                      View Documentation
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="h-4 w-4 fill-current text-emerald-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span>1,000+ Active Merchants</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="h-4 w-4 fill-current text-emerald-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span>10,000+ Transactions Processed</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#02569B]/20 to-emerald-500/20 rounded-2xl blur-3xl" />
                  <div className="relative z-10 rounded-xl border bg-background p-4 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <div className="text-xs text-muted-foreground">dashboard.connectx.com</div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <div className="text-sm font-medium">Monthly Revenue</div>
                        <div className="mt-2 text-2xl font-bold">$24,512.65</div>
                        <div className="mt-1 flex items-center text-xs text-emerald-500">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                          <span className="ml-1">12.5% from last month</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-muted p-4">
                          <div className="text-sm font-medium">Orders</div>
                          <div className="mt-2 text-xl font-bold">356</div>
                        </div>
                        <div className="rounded-lg bg-muted p-4">
                          <div className="text-sm font-medium">Customers</div>
                          <div className="mt-2 text-xl font-bold">1,204</div>
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <div className="text-sm font-medium">API Status</div>
                        <div className="mt-2 flex items-center">
                          <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2" />
                          <span className="text-sm font-medium">All Systems Operational</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners / Tenants */}
        <section className="py-12 border-t border-border">
          <div className="container px-4 md:px-6">
            <h2 className="text-center text-sm font-medium tracking-wider text-muted-foreground uppercase mb-8">
              Trusted by
            </h2>
            <PartnerScroll />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gradient-to-r from-emerald-400/20 to-green-500/20 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Core Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything you need to succeed
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ConnectX provides all the essential backend services for your e-commerce platform, allowing you to
                  focus on what matters most.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Card 1 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-[#02569B]">
                  <Database className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Centralized Backend</h3>
                <p className="text-sm text-muted-foreground">
                  A shared infrastructure that handles all your backend needs, reducing development costs and
                  complexity.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 2 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-[#02569B]">
                  <Package className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Inventory Management</h3>
                <p className="text-sm text-muted-foreground">
                  Efficiently track and manage your product inventory with real-time updates and alerts.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 3 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-[#02569B]">
                  <ShoppingCart className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Streamline your order fulfillment with automated processing and status tracking.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 4 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-[#02569B]">
                  <Lock className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">User Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Secure user authentication and authorization with built-in security features.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 5 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-[#02569B]">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Dual Product Listings</h3>
                <p className="text-sm text-muted-foreground">
                  List products as private or public, fostering a collaborative marketplace ecosystem.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 6 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-[#02569B]">
                  <Zap className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Scalable Architecture</h3>
                <p className="text-sm text-muted-foreground">
                  Built to grow with your business, handling increased traffic and transactions with ease.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Sample */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gradient-to-r from-emerald-400/20 to-green-500/20 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Developer Friendly
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Create a Product in 3 Lines of Code</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our RESTful APIs are designed to be intuitive and easy to integrate with your frontend.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="rounded-lg bg-zinc-950 p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-sm text-zinc-400">Create a new product</span>
                  <div className="ml-auto flex gap-2">
                    <button className="text-xs text-zinc-400 hover:text-white">Copy</button>
                  </div>
                </div>
                <pre className="overflow-x-auto text-sm text-zinc-300">
                  <code>{`// Example: Creating a new product
fetch('https://api.connectx.com/products', {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_API_KEY'
},
body: JSON.stringify({
  name: 'Premium Headphones',
  description: 'High-quality wireless headphones with noise cancellation',
  price: 149.99,
  category: 'electronics',
  stock_quantity: 100
})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Vertical Steps */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gradient-to-r from-emerald-400/20 to-green-500/20 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get your e-commerce platform up and running in just three simple steps.
                </p>
              </div>
            </div>
            <ProcessSteps />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gradient-to-r from-emerald-400/20 to-green-500/20 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Success Stories
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Customers Say</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from entrepreneurs who have transformed their businesses with ConnectX.
                </p>
              </div>
            </div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gradient-to-r from-emerald-400/20 to-green-500/20 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Common Questions
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to the most common questions about ConnectX.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is ConnectX?</AccordionTrigger>
                  <AccordionContent>
                    ConnectX is a centralized, multi-tenant backend framework for e-commerce that provides all the
                    necessary infrastructure and APIs to build and scale your online store. It handles product
                    management, inventory, orders, payments, and user authentication so you can focus on your brand and
                    customer experience.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How much does ConnectX cost?</AccordionTrigger>
                  <AccordionContent>
                    ConnectX offers flexible pricing plans starting with a free tier for startups and small businesses.
                    Our paid plans start at 2.5% per transaction with no monthly fees. Enterprise plans with custom
                    pricing are available for larger businesses with specific requirements. Visit our pricing page for
                    detailed information.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Do I need technical knowledge to use ConnectX?</AccordionTrigger>
                  <AccordionContent>
                    While some technical knowledge is helpful, ConnectX is designed to be accessible to users with
                    varying levels of technical expertise. We provide comprehensive documentation, ready-to-use
                    templates, and a user-friendly dashboard. For non-technical users, our templates and partner network
                    can help you get started quickly.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I migrate my existing store to ConnectX?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer migration tools and services to help you seamlessly transfer your products, customers,
                    and order history from popular platforms like Shopify, WooCommerce, and Magento. Our team can
                    provide personalized assistance to ensure a smooth transition without disrupting your business
                    operations.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What payment gateways does ConnectX support?</AccordionTrigger>
                  <AccordionContent>
                    ConnectX integrates with all major payment processors including Stripe, PayPal, Square, and regional
                    payment providers. We also support cryptocurrency payments and buy-now-pay-later services like
                    Klarna and Afterpay, giving your customers flexible payment options.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#02569B] to-[#0288d1]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to simplify your e-commerce journey?
                </h2>
                <p className="max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of entrepreneurs who are building successful online businesses with ConnectX.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
                <Link href="/signup">
                  <Button className="bg-white text-[#02569B] hover:bg-blue-50 px-8 h-12 rounded-md">
                    Get Started Now
                  </Button>
                </Link>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 h-12 rounded-md">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-[#02569B]" />
                <span className="text-xl font-bold">
                  Connect
                  <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    X
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Democratizing e-commerce technology worldwide.</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="text-muted-foreground hover:text-foreground">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/docs/quickstart" className="text-muted-foreground hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ConnectX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
