import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

import { RESOURCES, ACTIONS, checkPermission } from './lib/rbac-base';

const intlMiddleware = createIntlMiddleware(routing);

const PENDING_2FA_COOKIE = 'eitdc_2fa_pending';

export async function proxy(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Skip middleware for static files and API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') // static files
    ) {
      return NextResponse.next();
    }

    // /auth/verify gate: require the eitdc_2fa_pending cookie. Without it the
    // user has no in-progress 2FA challenge to complete, so send them back to
    // /auth/login. Runs before the general /auth branch below so authenticated
    // users that somehow reach /auth/verify without a pending cookie also get
    // redirected here.
    if (pathname.startsWith('/auth/verify')) {
      const pending = req.cookies.get(PENDING_2FA_COOKIE);
      if (!pending) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      return NextResponse.next();
    }

    // Get authentication token for the remaining branches.
    let token: Awaited<ReturnType<typeof getToken>> | null = null;
    try {
      token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    } catch (e) {
      console.error('[proxy] getToken threw — continuing as unauthenticated', e);
    }

    // Handle auth routes - these don't need locale
    if (pathname.startsWith('/auth')) {
      if (token) {
        const permissions = (token as { permissions?: unknown }).permissions as
          | Array<{ resource: string; action: string }>
          | undefined;
        const hasDashboardAccess = checkPermission(
          permissions,
          RESOURCES.DASHBOARD,
          ACTIONS.READ,
        );

        if (hasDashboardAccess) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
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

      const permissions = (token as { permissions?: unknown }).permissions as
        | Array<{ resource: string; action: string }>
        | undefined;
      const hasDashboardAccess = checkPermission(
        permissions,
        RESOURCES.DASHBOARD,
        ACTIONS.READ,
      );

      if (!hasDashboardAccess) {
        return NextResponse.redirect(
          new URL('/auth/error?error=AccessDenied', req.url),
        );
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
  } catch (e) {
    console.error('[proxy] uncaught error — passing through', e);
    return NextResponse.next();
  }
}

function getPreferredLocale(req: NextRequest): string {
  const localeCookie = req.cookies.get('NEXT_LOCALE');
  if (localeCookie && ['ar', 'en'].includes(localeCookie.value)) {
    return localeCookie.value;
  }

  const acceptLanguage = req.headers.get('accept-language');
  if (acceptLanguage) {
    if (acceptLanguage.toLowerCase().includes('ar')) return 'ar';
    if (acceptLanguage.toLowerCase().includes('en')) return 'en';
  }

  return 'ar';
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
