# Testing Strategy

## Primary Focus
EBIC testing prioritizes critical user workflows: Form Submissions and RBAC Boundaries.

## Tools
- `bun test` runner integrated alongside `Jest` + React Testing Library (RTL).
- Tests must map functionally to `.agent/rules.yaml` assertions.

## File Organization
- Tests exist adjacent to their domain modules in nested directories `src/features/[feature]/__tests__/`.
- Typical structures include `components.test.tsx`, `api.test.ts`, and `utils.test.ts`.

## Constraints Strategy
**1. RBAC Tests (High Priority)**
Integration checks validating endpoints return HTTP 403 on missing or insufficient permissions regardless of active valid session tokens.

**2. Schema Tests**
Unit checks manually asserting `innovatorServerSchema.safeParse({})` properly errors immediately against mandatory fields (verifying the absence of `.optional()` regressions).

**3. Component Mocks**
Ensure React contexts (like `next-intl` providers mapping `t()`) are adequately stubbed to prevent snapshot explosions when text structures evolve.
