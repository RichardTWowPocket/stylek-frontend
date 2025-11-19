import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Onboarding pages require authentication but allow any role
    // This allows users to complete their profile regardless of current role
    // (e.g., CREATOR role user can access /brand/onboarding if they registered as BRAND)
    if (path === '/brand/onboarding' || path === '/creator/onboarding') {
      // Must be authenticated (has token)
      // If no token, redirect to login - NextAuth will handle OAuth callback properly
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }

    // Check role-based access (but skip onboarding pages)
    if (path.startsWith('/brand') && !path.includes('/onboarding') && token?.role !== 'BRAND') {
      return NextResponse.redirect(new URL('/403', req.url));
    }

    if (path.startsWith('/creator') && !path.includes('/onboarding') && token?.role !== 'CREATOR') {
      return NextResponse.redirect(new URL('/403', req.url));
    }

    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes don't need auth
        if (
          path.startsWith('/login') ||
          path.startsWith('/register') ||
          path === '/'
        ) {
          return true;
        }

        // Onboarding pages: require token (must be authenticated)
        // NextAuth redirect callback will redirect to /login first, then to onboarding
        if (path === '/brand/onboarding' || path === '/creator/onboarding') {
          return !!token; // Require token - must be authenticated
        }

        // Protected routes need auth
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

