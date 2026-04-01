# Error Handling Strategy

## Form Level (Client State)
- Errors returned by `.safeParse(data)` in Zod are locally aggregated and attached to the `FormStore`.
- React Hook Form automatically bubbles individual `field` issues. 
- Form Wizards implementing `useFormController.validateStep` should halt `nextStep` sequence triggers if any internal `validateStep` logic flags a `false` object.
- **UX Requirement**: Components should automatically scroll failing container views into focus and visually assert the presence of structural problems using red-tinted alert boxes (`<Alert variant="destructive">`). Include `aria-live="polite"` or `aria-live="assertive"` onto error boxes to instantly broadcast failure events to VoiceOver.

## Transport Level (Network Error)
- If a Hono RPC request fails (e.g. S3 timeout), map the `fetch` rejection state into a localized string: `t('errors.somethingWentWrong')`. 
- Global notifications or toasts from `shadcn/ui` should execute `toast({ variant: 'destructive', title: errorMsg })`.

## Anti-Pattern
Silently swallowing `.catch()` without logging to screen UI or clearing the `isSubmitting`/`isPending` boolean lock. Components must always revert to an actionable state upon error.
