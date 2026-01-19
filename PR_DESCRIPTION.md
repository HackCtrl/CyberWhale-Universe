Title: Improve design system — tokens, components, accessibility, animations

Summary:
- Added standardized design tokens (colors, typography, radii, shadows, motion) in `src/styles/theme.css` and `src/styles/design-tokens.json`.
- Implemented helper CSS classes: `.cw-btn`, `.cw-card`, `.cw-input`, `.cw-progress`, `.cw-spinner`, `.cw-fade-in`, `.cw-stars-layer`.
- Updated components to use tokens/helpers: `button.tsx`, `card.tsx`, `progress.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`.
- Added a contrast check script `scripts/check-contrast.cjs` and adjusted `--secondary` color to meet WCAG AAA (normal text).
- Created `DESIGN_SYSTEM.md` with Figma prompt and usage guidance.

Files changed (high level):
- src/styles/theme.css
- src/styles/design-tokens.json
- src/styles/design-tokens.json
- src/app/components/ui/button.tsx
- src/app/components/ui/card.tsx
- src/app/components/ui/progress.tsx
- src/app/components/ui/input.tsx
- src/app/components/ui/textarea.tsx
- src/app/components/ui/select.tsx
- scripts/check-contrast.cjs
- DESIGN_SYSTEM.md

How to test locally:

1. Install deps (already done):

```bash
npm install
```

2. Run contrast checker:

```bash
node ./scripts/check-contrast.cjs
```

3. Run dev server:

```bash
npm run dev
```

4. Visual checks:
- Inspect buttons, cards, inputs across pages; hover and focus states.
- Check mobile/tablet breakpoints (next steps — I can update responsive sizes on request).

Suggested git steps to create PR:

```bash
git checkout -b feat/design-system-unify
git add .
git commit -m "chore(design): add design tokens, update components, accessibility fixes"
git push origin feat/design-system-unify
# then open PR in your remote (GitHub/GitLab)
```

Notes / Next steps:
- Mobile/tablet-specific tweaks (touch targets, nav simplification) — not yet applied.
- Additional accessibility run: keyboard navigation, aria attributes audit.
- I can prepare a small visual demo branch with route showcasing updated components.

If you want, я могу автоматически open a PR (if you provide remote access or want me to prepare the git commands and run them here).