## Constitution Update Workflow

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

**Note**: If `.specify/memory/constitution.md` does not exist yet, it should have been initialized from `.specify/templates/constitution-template.md` during project setup. If it's missing, copy the template first.

Follow this execution flow:

1. Load the existing constitution at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
   - **Normative Language**: All principles and rules MUST use RFC2119 terms:
     - **MUST**: This requirement is absolute.
     - **SHOULD**: Valid reasons may exist to ignore, but full implications must be understood.
     - **MAY**: Truly optional item.
   - **Precedence Rules**: When deriving values for placeholders or conflicting rules:
     1. Direct User Prompt (Highest)
     2. Project documentation (`spec.md`, `README.md`)
     3. Global Configuration (`.specify/init-options.json`)
     4. Default Template Values (Lowest)
   - **Principle Count**: If a specific number of principles is requested, respect it. Otherwise, follow the general template.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist:
   For each item below, perform a sub-action: **[Auto-fix]**, **[Flag]**, or **[Prompt]**.
   - Read `.specify/templates/plan-template.md` and ensures any "Constitution Check" or rules align with updated principles. **[Auto-fix]**
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment. **[Auto-fix]**
   - Read `.specify/templates/tasks-template.md` for task categorization alignment. **[Auto-fix]**
   - Read all command files in `.agent/commands/*.md` and `.claude/commands/*.md` to verify no outdated references remain. **[Auto-fix]**
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`). **[Flag]** if manual text requires rewriting.
   - **Placeholder Rule**: ALL bracketed tokens (e.g. `[TOKEN]`) MUST be removed from the final output. If a value is unknown, use "TBD" or "NOT DEFINED" without brackets.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).
