export const isBuildPhase =
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.npm_lifecycle_event === 'build';

/**
 * Returns the normalized site URL from environment variables.
 * Falls back to localhost in development, but throws in production if missing.
 */
export const getSiteUrl = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL;

  if (!url) {
    if (process.env.NODE_ENV === 'development' || isBuildPhase) {
      return 'http://localhost:3000';
    }
    throw new Error('NEXT_PUBLIC_SITE_URL is not defined in environment variables');
  }

  return url.replace(/\/$/, '');
};
