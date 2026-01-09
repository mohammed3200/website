## Relations
@compliance/project_rules/authoritative_project_rules.md

## Raw Concept
**Task:**
Align naming and UI standards with authoritative project rules

**Changes:**
- Clarify that snake_case is the absolute naming standard for all files and folders.
- Reiterate UI consistency rules from the authoritative source.

**Files:**
- antigravity/rules.yaml
- src/components/ui/

**Timestamp:** 2026-01-09

## Narrative
### Features
- **Naming Convention (NAME-01)**: All files and folders must use `snake_case` naming. This is an authoritative rule from `antigravity/rules.yaml` and overrides any conflicting documentation (e.g., `docs/IMPLEMENTATION_STATUS.md`).
- **UI Consistency (UI-01)**: Only pre-defined shared components from `src/components/ui/` or other shared directories must be used.
- **Visual/Functional Alignment (UI-02)**: Any new component must be visually and functionally consistent with existing components to maintain unified UX.
