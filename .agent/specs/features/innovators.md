# Feature Specification: Innovators Domain

## Overview
The Innovators module powers the public registration form and admin review pipeline for new projects seeking incubation at EBIC. 

## Flow
1. **Public Registration**: A 4-step wizard collecting Personal Info -> Project Overview -> Project Details -> Review & Submit.
2. **State Management**: Zustand store (`useInnovatorFormStore`) persists data via `localStorage`. The store initialized state must NOT contain `undefined` boundaries that bypass validation.
3. **Admin Actions**: Administrators review the submitted application. They can dispatch an `APPROVED` or `REJECTED` status using the `/api/innovators/:innovatorId` PATCH route.
4. **Visibility**: `APPROVED` innovators are flagged `isVisible: true` and exposed via the `/api/innovators/public` Next.js route for public site display.

## Validation Strategy
- strict Zod payloads (`innovatorServerSchema`).
- `.optional()` MUST NEVER be applied to logically required fields (e.g., `name`, `projectTitle`).
- Zod `error` objects must map exactly to keys in `messages/en.json` and `messages/ar.json`.

## API Contract
**POST /api/innovators**
```json
// Request
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "projectTitle": "Water Desalination AI",
  "stageDevelopment": "PROTOTYPE"
  // ... nested Form Data with files
}
// Expects: 201 Created
```

**PATCH /api/innovators/:id**
```json
// Request (Admin Only)
{
  "status": "APPROVED",
  "reason": "Meets criteria",
  "locale": "ar"
}
```
