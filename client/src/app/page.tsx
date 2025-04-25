import Link from "next/link"
import { ArrowRight, BarChart2, CheckCircle, Code, CreditCard, Database, MessageSquare, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-gradient-to-b from-blue-600 to-blue-700">
        <header className="container z-10 flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-white">ConnectX</span>
            </Link>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#" className="text-sm text-white/80 transition-colors hover:text-white">
              Features
            </Link>
            <Link href="#" className="text-sm text-white/80 transition-colors hover:text-white">
              Pricing
            </Link>
            <Link href="#" className="text-sm text-white/80 transition-colors hover:text-white">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login-register" className="text-sm text-white/80 transition-colors hover:text-white">
              Login
            </Link>
            <Link
              href="/login-register?tab=register"
              className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-white/90"
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-80px)] pb-24 pt-16 flex items-center">
          <div className="container relative z-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                  The E-commerce <br />
                  Backend That Powers <br />
                  Your Growth
                </h1>
                <p className="max-w-md text-white/80">
                  ConnectX is a centralized backend framework that democratizes e-commerce for entrepreneurs, startups,
                  and students.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="/login?tab=register"
                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-white/90"
                  >
                    Get Started Today
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex items-center rounded-md border border-white/30 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                  >
                    Request a Demo
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-8">
                  <div className="rounded-md bg-blue-500/30 p-4 text-white">
                    <div className="text-2xl font-bold">1,000+</div>
                    <div className="text-sm text-white/80">Active Merchants</div>
                  </div>
                  <div className="rounded-md bg-blue-500/30 p-4 text-white">
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-sm text-white/80">Transactions</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-full max-w-md rounded-lg bg-blue-400/20 backdrop-blur-sm md:h-80"></div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[url('/wave.svg')] bg-cover bg-no-repeat"></div>
        </section>
      </div>

      <main className="flex-1 bg-white">
        {/* Features Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Everything You Need to Succeed</h2>
            <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
              ConnectX provides a comprehensive set of tools to build, manage, and scale your e-commerce business.
            </p>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start gap-4 rounded-lg p-6">
                <div className="rounded-md bg-blue-100 p-2 text-blue-600">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Centralized Backend</h3>
                <p className="text-gray-600">
                  Provide the ready-to-deploy backend system. Focus on your brand and customers.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 rounded-lg p-6">
                <div className="rounded-md bg-blue-100 p-2 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Multi-Merchant System</h3>
                <p className="text-gray-600">
                  Different capabilities for seller and store that increases scalability across business models.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 rounded-lg p-6">
                <div className="rounded-md bg-blue-100 p-2 text-blue-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Comprehensive Logging</h3>
                <p className="text-gray-600">
                  Store system logs at one location so keep track explorer your business flow in detail.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 rounded-lg p-6">
                <div className="rounded-md bg-blue-100 p-2 text-blue-600">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Flexible Payments</h3>
                <p className="text-gray-600">
                  Integrate with popular payment gateways and services. Pay only what you use.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 rounded-lg p-6">
                <div className="rounded-md bg-blue-100 p-2 text-blue-600">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Developer-Friendly API</h3>
                <p className="text-gray-600">
                  Well-documented API that enables the customization of your e-commerce solutions.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 rounded-lg p-6">
                <div className="rounded-md bg-blue-100 p-2 text-blue-600">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Comprehensive Analytics</h3>
                <p className="text-gray-600">
                  Get real-time insights and recommendations to optimize your business strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Fair and Transparent Pricing</h2>
            <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
              Our pricing is simple, affordable, and scales with your success.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold">Verified Merchants</h3>
                <p className="mb-6 text-gray-600">For established businesses with their own branding.</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">%</span>
                    <span className="text-5xl font-bold">of profits</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Create users & access levels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Advanced inventory management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Comprehensive analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Third-party payment integration</span>
                  </li>
                </ul>

                <Link
                  href="/login?tab=register"
                  className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>

              <div className="rounded-lg border bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold">Unverified Merchants</h3>
                <p className="mb-6 text-gray-600">For startups and entrepreneurs just getting started.</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">%</span>
                    <span className="text-5xl font-bold">of profits</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Access to public product listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Basic inventory management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Standard analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Secure payment processing</span>
                  </li>
                </ul>

                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="mb-4 text-center text-3xl font-bold">What Our Merchants Say</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
              Entrepreneurs and businesses are already transforming their e-commerce journey with ConnectX.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border p-6">
                <div className="mb-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  "ConnectX allowed me to focus on my products and marketing instead of worrying about backend
                  technology. After 6 weeks, I was able to launch my store."
                </p>
                <div className="mt-4">
                  <p className="font-semibold">Sarah Williams</p>
                  <p className="text-sm text-gray-500">Fashion Entrepreneur</p>
                </div>
              </div>

              <div className="rounded-lg border p-6">
                <div className="mb-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  "As an established merchant, I was able to shift my entire operation to ConnectX. The platform's
                  flexibility allowed me to create a unique shopping experience."
                </p>
                <div className="mt-4">
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-500">Retail Owner</p>
                </div>
              </div>

              <div className="rounded-lg border p-6">
                <div className="mb-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  "The analytics provided by ConnectX have been instrumental in optimizing our inventory and marketing.
                  We've seen a 40% performance and sales ratio driven."
                </p>
                <div className="mt-4">
                  <p className="font-semibold">Priya Patel</p>
                  <p className="text-sm text-gray-500">Online Retailer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="container">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Ready to Transform Your E-Commerce Experience?</h2>
              <p className="mx-auto mb-8 max-w-2xl text-white/80">
                Join thousands of entrepreneurs already growing their businesses with ConnectX.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/login?tab=register"
                  className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-blue-600 hover:bg-white/90"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="w-full max-w-xs sm:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-md border-0 px-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12 text-white">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">ConnectX</h3>
              <p className="mb-4 text-sm text-gray-400">
                Democratizing e-commerce technology for entrepreneurs worldwide.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-sm text-gray-400">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <p>© 2023 ConnectX. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-white">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-white">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
