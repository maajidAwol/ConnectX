import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Building2, Code2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            E
          </div>
          <span className="font-bold text-xl">E-Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Multi-Tenant E-commerce Platform</h1>
          <p className="text-xl text-muted-foreground mb-8">A comprehensive solution for merchants and developers</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                Documentation
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Merchants</CardTitle>
              <CardDescription>Manage products, control visibility, and access templates</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Product catalog management</li>
                <li>Order processing</li>
                <li>Customer database</li>
                <li>Analytics and reporting</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/login?role=merchant" className="w-full">
                <Button className="w-full" variant="outline">
                  Merchant Login
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Developers</CardTitle>
              <CardDescription>Discover products, access APIs, and build custom frontends</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Product marketplace</li>
                <li>API explorer</li>
                <li>Implementation resources</li>
                <li>Project management</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/login?role=developer" className="w-full">
                <Button className="w-full" variant="outline">
                  Developer Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                E
              </div>
              <span className="font-bold">E-Platform</span>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            © {new Date().getFullYear()} E-Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

