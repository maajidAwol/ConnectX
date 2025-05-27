import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
// import { SiteHeader } from "@/components/site-header"
import HeaderWrapper from "@/components/header-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ConnectX - Your Plug-and-Play E-Commerce Backend",
  description:
    "A centralized, multi-tenant backend framework for e-commerce, empowering entrepreneurs to build without barriers.",
  icons: {
    icon: "https://res.cloudinary.com/denhfpk51/image/upload/v1748338458/categories/categories/2066b626-880c-45fd-bab5-5fa0e926ab25.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <HeaderWrapper />
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
