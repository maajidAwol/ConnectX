import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Check if user is authenticated by looking for the tokens in cookies
  const isAuthenticated = request.cookies.has('accessToken') && request.cookies.has('refreshToken')
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || 
                       path === '/signup' || 
                       path === '/' || 
                       path.startsWith('/verify-email') ||
                       path.startsWith('/docs') || 
                       path.startsWith('/templates') || 
                       path.startsWith('/pricing') || 
                       path.startsWith('/_next') || 
                       path.startsWith('/api') ||
                       path.startsWith('/static') || 
                       path.startsWith('/images') || 
                       path.startsWith('/favicon')
  
  // Check for role-specific paths
  const isMerchantPath = path.startsWith('/merchant')
  const isAdminPath = path.startsWith('/admin')
  
  // Get user role from cookies if available
  const userRole = request.cookies.get('userRole')?.value
  
  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // If user is not authenticated and trying to access protected route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Role-based access control
  if (isAuthenticated) {
    // Prevent merchants from accessing admin routes
    if (isAdminPath && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/merchant', request.url))
    }
    
    // Prevent admins from accessing merchant routes
    if (isMerchantPath && userRole !== 'owner') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }
  
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except for static files, api routes, etc.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 