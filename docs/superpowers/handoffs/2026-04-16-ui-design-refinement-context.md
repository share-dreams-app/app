# UI Design Refinement - Context Handoff

## Session Status

- Date: 2026-04-16
- Current branch: `fix/ui-design-refinement`
- Objective: improve visual design/layout of MVP app screens
- Implementation status: **not started yet** (waiting for references/inspiration)

## Screens In Scope

- `src/app/(app)/dashboard/dashboard-client.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/dreams/[dreamId]/page.tsx`
- `src/app/(app)/insights/page.tsx`
- `src/components/paywall-banner.tsx`

## Current UI Notes

- Styling is currently inline style objects in TSX files.
- No central CSS theme system is in place yet (tokens/variables).
- Existing layout works functionally, but visual direction is still temporary.

## Expected Next Input From User

Provide design references/assets to drive the new pattern:

1. Screens or exports (Figma/Canva/PowerPoint) in PNG/PDF.
2. Visual system choices (fonts, colors, spacing, radius, shadows).
3. Priority for fidelity:
   - pixel-perfect replica
   - faithful adaptation with UX improvements
4. Responsive intent (desktop/mobile behavior expectations).

## Suggested Next Execution Sequence

1. Align on one visual direction (2-3 approaches + chosen direction).
2. Define reusable design tokens (colors, typography, spacing, surfaces).
3. Refactor shared UI primitives first (container/card/button/badge/banner).
4. Apply consistently across dashboard, dream detail, and insights.
5. Verify responsive behavior + rerun:
   - `npm run test`
   - `npm run test:e2e`
   - `npm run build`

## Important Repository State

- Working tree currently has unrelated local change in `package-lock.json` (already present before design edits in this session).
- No UI design edits were applied in this branch yet.
