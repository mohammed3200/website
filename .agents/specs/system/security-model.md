# Security & Access Control Model

## Authentication 
Managed entirely via **NextAuth v5**. 
- Supports Local Credentials + OAuth (Google/Github).
- Users failing MFA constraints are held in a 2FA holding state managed via session interceptors.
- Session tokens are strictly encrypted.

## Role-Based Access Control (RBAC) System
Located at `src/lib/rbac.ts` and `src/lib/rbac-base.ts`. 

### Definitions:
1. **System Roles**: `SUPER_ADMIN`, `ADMIN`, `NEWS_EDITOR`, `REQUEST_REVIEWER`, `VIEWER`.
2. **Resources**: `RESOURCES.USERS`, `RESOURCES.INNOVATORS`, `RESOURCES.NEWS`, etc.
3. **Actions**: `ACTIONS.CREATE`, `ACTIONS.READ`, `ACTIONS.UPDATE`, `ACTIONS.DELETE`, `ACTIONS.MANAGE`, `ACTIONS.APPROVE`, `ACTIONS.REJECT`.

### Enforcement Gateways:
1. **Middleware (`middleware.ts`)**: Broadly secures path structures (e.g., `/admin/*` requires `session.user.role`). 
2. **Hono Route Logic**: Granularly checks exact method intent:
```typescript
const hasPermission = checkPermission(
  session.user.permissions,
  RESOURCES.INNOVATORS,
  ACTIONS.UPDATE
);
if (!hasPermission) return c.json({ error: 'Insufficient permissions' }, 403);
```
3. **UI Gateways**: Conditionally render buttons or navigation links using client-side RBAC hooks querying the local verified session array.

### Secret Management
API keys (like `OJS_API_KEY` for integrations, S3 Access tokens) must exclusively live in `.env`. Hardcoding keys in bridge files or UI is prohibited.
