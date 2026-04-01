# Feature Specification: Collaborators Domain

## Overview
The Collaborators module handles partnership/sponsorship requests from external entities looking to support EBIC.

## Flow
1. **Public Registration**: A multi-step form: Company Information -> Industry & Expertise -> Resources & Support -> Review & Submit.
2. **Media Upload**: Supports nested file uploads (e.g., Company Logo). 
3. **Admin Actions**: Status changes (`APPROVED`, `REJECTED`) invoke the `notifyAdmins` BullMQ queue to alert other system admins, and dispatch an email via `emailService.sendStatusUpdate` to the collaborator.

## Validation Strategy
- Same schema requirements as the Innovators domain: strict Zod payloads, no accidental `.optional()` looseness on mandatory fields, explicit `error` parsing matching the localized JSON tables.
- Navigational guards must be enforced in the `collaborator-form-wizard.tsx` `useEffect` to prevent explicit URL deep-linking meant to bypass required step validations.

## API Contract
**POST /api/collaborator**
Similar mapping to Innovators but parsing `Collaborator` generic types via `@hono/zod-validator`.

**PATCH /api/collaborator/:id**
Requires `auth()` and RBAC: `RESOURCES.COLLABORATORS + ACTIONS.UPDATE`.
