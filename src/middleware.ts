import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { auth } from '@/auth';
import { 
    apiAuthPrefix, 
    authRoutes, 
    publicRoutes, 
    DEFAULT_LOGIN_REDIRECT,
    adminRoutes
} from '@/routes';

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
    const { nextUrl } = req;
    console.log('[Middleware] Processing:', nextUrl.pathname);
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));

    // Handle API auth routes
    if (isApiAuthRoute) {
        return; // Don't block API auth routes
    }

    // Handle auth routes (login, register, etc.)
    if (isAuthRoute) {
        if (isLoggedIn) {
            // Check if user has admin permissions to redirect to dashboard
            const permissions = req.auth?.user?.permissions as Array<{resource: string, action: string}> | undefined;
            const hasDashboardAccess = permissions?.some(
                p => p.resource === 'dashboard' && (p.action === 'read' || p.action === 'manage')
            );

            if (hasDashboardAccess) {
                return Response.redirect(new URL('/admin/dashboard', nextUrl));
            }
            
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
    }

    // Handle admin routes
    if (isAdminRoute) {
        if (!isLoggedIn) {
            const loginUrl = new URL('/auth/login', nextUrl);
            loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
            return Response.redirect(loginUrl);
        }

        const permissions = req.auth?.user?.permissions as Array<{resource: string, action: string}> | undefined;
        const hasDashboardAccess = permissions?.some(
            p => p.resource === 'dashboard' && (p.action === 'read' || p.action === 'manage')
        );
        
        if (!hasDashboardAccess) {
            return Response.redirect(new URL('/auth/error?error=AccessDenied', nextUrl));
        }
    }

    return intlMiddleware(req);
});

export const config = {
    // Match only internationalized pathnames
    // specific matcher to avoid matching static files and api
    matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
