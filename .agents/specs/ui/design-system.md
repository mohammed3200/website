# UI & Design System Rules

## Framework Integration
- EBIC uses `shadcn/ui` based on Tailwind CSS.
- React components must execute efficiently, aggressively isolating interactive logic using the `"use client"` directive at the component file apex.
- Headless UI interactions are bound by standard web accessibility attributes.

## Colors & Theming
- Primary branding dictates gradients mapping roughly to orange subsets (`from-orange-400 to-orange-600` ranges utilized heavily in the login interface).
- Background layering relies extensively on `from-gray-50`/`via-background` style Tailwind macros.

## Forms & Validation Overlays
- When using `Zod` combined with `react-hook-form`, error messages must bind to standard components (e.g., `<FormMessage className="text-red-500 text-xs mt-1" />`).
- Required inputs must show visual `*` indicators (often tied to localized labeling strings) when generated structurally in the forms.

## Localization Layouts (RTL/LTR)
- Always pass native `dir={isArabic ? 'rtl' : 'ltr'}` tags onto major content boundaries (or utilize `next-intl`'s document-level `<html dir="rtl">` routing outputs).
- Do not hardcode margins that break inverted reading (`mr-4` vs `ml-4`). Use logical properties (`ms-4`, `me-4`) or toggle classes dynamically if specifically needed based on the active locale.
