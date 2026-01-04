import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Get authentication token for admin check
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Handle auth routes - these don't need locale
  if (pathname.startsWith('/auth')) {
    if (token) {
      if (token.permissions) {
        const permissions = token.permissions as Array<{resource: string, action: string}>;
        const hasDashboardAccess = permissions.some(
          p => p.resource === 'dashboard' && (p.action === 'read' || p.action === 'manage')
        );
        
        if (hasDashboardAccess) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
      }
      
      const locale = getPreferredLocale(req);
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
    return NextResponse.next();
  }
  
  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (token.permissions) {
      const permissions = token.permissions as Array<{resource: string, action: string}>;
      const hasDashboardAccess = permissions.some(
        p => p.resource === 'dashboard' && (p.action === 'read' || p.action === 'manage')
      );
      
      if (!hasDashboardAccess) {
        return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', req.url));
      }
    }
    
    return NextResponse.next();
  }
  
  // Handle root path - redirect to preferred locale
  if (pathname === '/') {
    const locale = getPreferredLocale(req);
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }
  
  // All other routes handled by intl middleware
  return intlMiddleware(req);
}

function getPreferredLocale(req: NextRequest): string {
  // Check cookie for saved preference
  const localeCookie = req.cookies.get('NEXT_LOCALE');
  if (localeCookie && ['ar', 'en'].includes(localeCookie.value)) {
    return localeCookie.value;
  }
  
  // Check Accept-Language header
  const acceptLanguage = req.headers.get('accept-language');
  if (acceptLanguage) {
    if (acceptLanguage.toLowerCase().includes('ar')) return 'ar';
    if (acceptLanguage.toLowerCase().includes('en')) return 'en';
  }
  
  // Default to Arabic
  return 'ar';
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\..*).*)',
  ]
};