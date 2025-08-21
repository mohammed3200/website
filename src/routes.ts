/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/contact",
    "/entrepreneurship",
    "/incubators",
    "/collaborators",
    "/innovators",
    "/News",
    "/StrategicPlan",
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to appropriate pages.
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
    "/auth/verify-email",
    "/auth/callback",
    "/auth/invitation", // For accepting invitations
];

/**
 * Admin routes that require authentication and proper permissions.
 * @type {string[]}
 */
export const adminRoutes = [
    "/admin",
    "/admin/dashboard",
    "/admin/users",
    "/admin/news",
    "/admin/collaborators",
    "/admin/innovators",
    "/admin/settings",
    "/admin/invitations",
    "/admin/roles",
    "/admin/permissions",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in as admin.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/admin/dashboard";

/**
 * The default redirect path for regular users.
 * @type {string}
 */
export const DEFAULT_USER_REDIRECT = "/";

/**
 * Protected API routes that require authentication.
 * @type {string[]}
 */
export const protectedApiRoutes = [
    "/api/admin",
    "/api/users",
    "/api/invitations",
    "/api/roles",
    "/api/permissions",
];
