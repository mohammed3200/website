# Skeleton Loading & Interactions

## Fallback Principles
- Utilize React `<Suspense fallback={<Skeleton />}>` exclusively for structural UI layouts dependent on slower RPC queries or direct DB queries in Server Components.
- Implement standard `framer-motion` pulsing or Tailwind `animate-pulse` components for data table rows (`TableCell`, `Card`, `Chart` shells).
- **Loading State Indicators**: Form submission buttons MUST utilize `disabled={isSubmitting}` combined with visual loaders (e.g., `<RefreshCw className="animate-spin" />`) to prevent redundant payload mutations hitting the API. EBIC avoids full-page blocking overlays in favor of targeted local loading indicators.
