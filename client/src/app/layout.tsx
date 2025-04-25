import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ConnectX - The E-commerce Backend That Powers Your Growth",
  description:
    "ConnectX is a centralized backend framework that democratizes e-commerce for entrepreneurs, startups, and students.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <div>Top value</div> */}
        <div className="bg-gradient-to-b from-blue-600 to-blue-700 ">{children}</div>
      </body>
    </html>
  )
}
