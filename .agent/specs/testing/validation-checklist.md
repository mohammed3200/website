# Form Validation & i18n Quality Checklist

Before committing changes to form workflows, use this checklist to ensure compliance:

- [ ] Multi-step wizard correctly traps forward URL manipulation and returns user to the highest valid increment step index.
- [ ] Required Zod fields omit `.optional()` overrides. Empty object initializations result in validation failure, preventing empty DB blobs.
- [ ] Schema `error` tokens accurately map to existing entries in `messages/en.json` AND `messages/ar.json`.
- [ ] `StepLayout` components correctly apply `aria-live` containers to dynamically rendered summary alerts.
- [ ] Components explicitly use `useTranslations()` hook avoiding constant objects mapped to text constants like `COPY`.
- [ ] Translation functions passed outside direct closure scopes (e.g., config mapping) are strictly appended to the parent hook dependency arrays to react correctly to UI language changes.
