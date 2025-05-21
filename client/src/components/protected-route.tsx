"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredRoles?: string[]
}

/**
 * Client-side route protection component
 * Use this as a wrapper for pages that require authentication and/or specific roles
 * 
 * @example
 * ```tsx
 * // Single role requirement
 * <ProtectedRoute requiredRole="owner">
 *   <MerchantDashboard />
 * </ProtectedRoute>
 * 
 * // Multiple roles requirement
 * <ProtectedRoute requiredRoles={["owner", "member"]}>
 *   <MerchantDashboard />
 * </ProtectedRoute>
 * ```
 */
export default function ProtectedRoute({ children, requiredRole, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const validateToken = useAuthStore((state) => state.validateToken)
  
  useEffect(() => {
    // Validate token first
    const isValid = validateToken()
    if (!isValid) {
      router.push('/login')
      return
    }
    
    // Check authentication status
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // Check role requirement if specified
    const roles = requiredRoles || (requiredRole ? [requiredRole] : [])
    if (roles.length > 0 && !roles.includes(user?.role || '')) {
      // Redirect based on user role
      if (user?.role === 'admin') {
        router.push('/admin')
      } else if (user?.role === 'owner' || user?.role === 'member') {
        router.push('/merchant')
      } else {
        router.push('/')
      }
    }
  }, [isAuthenticated, requiredRole, requiredRoles, router, user, validateToken])
  
  // Don't render anything while checking authentication
  if (!isAuthenticated || !user) {
    return null
  }
  
  // Don't render if role requirement is not met
  const roles = requiredRoles || (requiredRole ? [requiredRole] : [])
  if (roles.length > 0 && !roles.includes(user.role)) {
    return null
  }
  
  return <>{children}</>
} 