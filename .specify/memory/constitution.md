<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Added Principles: Strict Zod Validation, i18n Completeness, Accessible UX, Stateless Navigation Guards
- Removed sections: N/A
- Templates requiring updates: ✅ None (no template changes needed)
- Follow-up TODOs: N/A
-->

# DigitoPub Constitution

## Core Principles

### I. Strict Form Validation
Zod schemas for mandatory fields MUST NOT use `.optional()`. Forms MUST initialize safely (e.g., using `defaultValues`) without bypassing validation. Schema properties must utilize explicit validation keys mapped to translation files (e.g., `{ error: "emailRequired" }` using Zod v4 syntax).

### II. i18n Completeness
All user-facing strings, including validation messages, component labels, and error alerts, MUST be strictly localized via `next-intl`. Hardcoded text dictionaries (such as manual `COPY` objects) inside React components are strictly prohibited. The English and Arabic JSON dictionaries must remain explicitly synchronized 1:1.

### III. Accessible UX
Client-side form workflows MUST prioritize accessibility. Invalid form submissions MUST trigger auto-scrolling to the error summary and utilize ARIA live regions (`aria-live="polite"`) to announce validation failures for screen reader compatibility. Focus management must strictly guide the user to the failure state.

### IV. Stateless Navigation Guards
Multi-step forms and workflows MUST enforce deterministic, step-by-step navigation guards. Components must validate the user's sequential progress using state stores, preventing URL-based bypassing or deep-linking into forward steps that have not passed intermediate validation gates.

### V. Defensive Closures & Caching
React functional components relying on dynamic references (such as `t()` translation functions) MUST include those references inside their dependency arrays (e.g., `useMemo`, `useEffect`, `useCallback`) to completely prevent stale closure bugs when the user dynamically flushes the application locale state.

## Architectural Constraints

### Security & Integrations
The OJS Bridge integration and all external API boundaries MUST securely load configuration strictly from environment variables or trusted configuration files. Sensitive keys (such as `OJS_API_KEY`) must never be statically hardcoded into bridge scripts or client bundles.

## Governance

All PRs/reviews must verify compliance with this Constitution.
Any new UI component or form logic MUST pass strict i18n and accessibility checks before merging.
Amendments to this constitution require a version bump and documented justification.

**Version**: 1.1.0 | **Ratified**: 2026-03-01 | **Last Amended**: 2026-04-01
