## Relations
@code_style/conventions/naming_and_ui_standards.md
@structure/roadmap/implementation_status_and_roadmap.md

## Raw Concept
**Task:**
Update authoritative project rules from antigravity/rules.yaml

**Changes:**
- Establishing the definitive project governance and architectural standards
- Enforcement of naming conventions and UI consistency as the source of truth (overriding legacy docs)
- Standardization of API, RPC, and data fetching patterns across the codebase

**Files:**
- antigravity/rules.yaml

**Flow:**
Developer -> Consults Authoritative Rules Memory -> Implements Feature -> Architectural Compliance Check

**Timestamp:** 2026-01-09

## Narrative
### Structure
- **ARCH-01 (Critical)**: New features must be under `src/features/<feature_name>`.
- **ARCH-02 & ARCH-REF-01 (Critical)**: Features must follow the standard structure: `api/`, `components/`, `server/`, `hooks/`, `schemas/`, `types/`, `constants/`, and `index.ts`.
- **API-GLOBAL-01 (Critical)**: Register feature APIs in `src/app/api/[[...route]]/route.ts` using Hono.
- **API-GLOBAL-02 (Critical)**: Attach routers via `app.route("/<feature>", <featureRouter>)`.
- **API-GLOBAL-03 (High)**: Global API must expose GET, POST, PATCH, DELETE via `handle(app)`.
- **FEAT-SERVER-01 (Critical)**: Feature server logic strictly in `src/features/<feature>/server/route.ts`.
- **FEAT-API-01 (Critical)**: Feature API hooks in `src/features/<feature>/api/use_<method>_<feature>.ts`.

### Dependencies
- **DEP-01 (Critical)**: Updating or adding any package is forbidden without explicit approval.
- **FEAT-API-02 (Critical)**: All feature APIs must use @tanstack/react-query.
- **RPC-01 (Critical)**: RPC client must be created using `hc` from `hono/client` and typed with `AppType`.
- **FEAT-SERVER-02 (Critical)**: `hono/zod-validator` and `zod` must be used for all request validation.
- **FEAT-SERVER-03 (Critical)**: CUD operations must be synchronized with the database schema.

### Features
- **UI-01 (High)**: Only pre-defined shared components must be used.
- **UI-02 (High)**: New components must be visually and functionally consistent with existing ones.
- **NAME-01 (Critical)**: All files and folders must use `snake_case` naming. This overrides any other naming conventions.
- **API-01 (High)**: Allowed API method names: `get`, `post`, `patch`, `delete`.
- **FEAT-SERVER-04 (High)**: UUID must be used for entity identifiers.
- **CLEAN-01 (Medium)**: Deprecated/replaced files must be removed.
