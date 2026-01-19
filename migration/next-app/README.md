Migration demo for CyberWhale UI

This folder is a safe migration scaffold demonstrating how your existing design system and tokens map to a Next.js 14 + TypeScript + Tailwind app.

What it contains:
- Minimal Next.js app using App Router (`app/`) and TypeScript
- Tailwind config consuming existing `src` files (so styles may be shared)
- A simple `Button` component demonstrating `cw-*` helpers and tokens

How to try locally:
1. From project root, change to the migration folder:

```bash
cd migration/next-app
```

2. Install dependencies (npm/yarn/pnpm):

```bash
npm install
# or
# pnpm install
# or
# yarn
```

3. Run dev server:

```bash
npm run dev
```

Notes:
- This is a scaffold only. It does not delete or change the main project.
- When ready to fully migrate, we can convert pages/route structure, copy components, and run a full integration.
