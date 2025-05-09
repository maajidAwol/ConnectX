import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication
const protectedPaths = [
  '/e-commerce/account',
  '/e-commerce/checkout',
  '/e-commerce/wishlist',
  '/e-commerce/orders',
];

// Add paths that should redirect to home if user is authenticated
const authPaths = [
  '/auth/login-illustration',
  '/auth/register-illustration',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('auth-storage')?.value;
  const isAuthenticated = token ? JSON.parse(token).state.isAuthenticated : false;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL('/auth/login-illustration', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home if accessing auth pages while authenticated
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 