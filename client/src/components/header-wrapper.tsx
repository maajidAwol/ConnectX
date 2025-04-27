"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/site-header"

const HeaderWrapper = () => {
  const pathname = usePathname()
  
  if (pathname === "/" || pathname === "/docs" || pathname === "/templates" || pathname === "/pricing") {
      return  <SiteHeader />
    }
    
// Don't show header 
  return null
}

export default HeaderWrapper 