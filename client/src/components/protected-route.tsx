"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { hasRole } from "@/utils/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

/**
 * Client-side route protection component
 * Use this as a wrapper for pages that require authentication and/or specific roles
 * 
 * @example
 * ```tsx
 * export default function MerchantDashboardPage() {
 *   return (
 *     <ProtectedRoute requiredRole="owner">
 *       <MerchantDashboard />
 *     </ProtectedRoute>
 *   )
 * }
 * ```
 */
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  
  useEffect(() => {
    // Check authentication status
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // Check role requirement if specified
    if (requiredRole && user?.role !== requiredRole) {
      if (user?.role === 'admin') {
        router.push('/admin')
      } else if (user?.role === 'owner') {
        router.push('/merchant')
      } else {
        router.push('/')
      }
    }
  }, [isAuthenticated, requiredRole, router, user])
  
  // Don't render anything while checking authentication
  if (!isAuthenticated) {
    return null
  }
  
  // Don't render if role requirement is not met
  if (requiredRole && user?.role !== requiredRole) {
    return null
  }
  
  return <>{children}</>
} 