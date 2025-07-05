import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { verifyToken } from './lib/security'; // Correct import name

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Handle admin route protection
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
      const payload = verifyToken(token); // Use verifyToken instead of verifyJwt
      // Allow only specific admin roles
      if (!['GENERAL_MANAGER', 'NEWS_EDITOR'].includes(payload.role)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
  
  // Handle public routes with internationalization
  return intlMiddleware(req);
}

export const config = {
  // Combined matcher for both i18n and admin routes
  matcher: [
    '/', 
    '/(ar|en)/:path*',
    '/admin/:path*'
  ]
};