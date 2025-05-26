import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should redirect to home if user is authenticated
const authPaths = [
  '/auth/login-illustration',
  '/auth/register-illustration',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  
  try {
    if (token) {
      const parsedToken = JSON.parse(token);
      isAuthenticated = parsedToken.state?.isAuthenticated || false;
    }
  } catch (error) {
    console.error('Error parsing auth token:', error);
  }

  // Only handle auth paths - redirect to home if already authenticated
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
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