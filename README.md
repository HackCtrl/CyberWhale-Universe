# CyberWhale Universe — локальный старт (MVP шаблон)

Кратко: в корне проекта есть `docker-compose.yml`, который поднимает Postgres, backend и frontend.

Локальный запуск (требуется Docker):

```bash
docker-compose up --build
```

Проверки после старта:
- Frontend: http://localhost:3000
- Backend health: http://localhost:4000/health

Если вы запускаете без Docker, можно перейти в `apps/backend` и `apps/frontend` и запустить локально через `npm ci` и `npm run dev`.
# CyberWhale Universe

![CI](https://github.com/HackCtrl/CyberWhale-Universe/actions/workflows/ci.yml/badge.svg)

Official repository for the CyberWhale Universe design concept and UI prototype.

Overview
--------
CyberWhale Universe is a cyber-security learning and competition platform with a space-cyberpunk visual language. This repository contains the current design system, UI components, styles, and a migration scaffold for moving the project to a Next.js + TypeScript stack.

Key highlights
--------------
- Unified design tokens (colors, typography, radii, shadows, motion)
- Accessible color palette (WCAG AAA checks)
- Reusable UI components (buttons, cards, inputs, progress bars) with states and animations
- A migration scaffold demonstrating Next.js 14 + TypeScript + Tailwind integration in `migration/next-app`
- Figma prompt and `DESIGN_SYSTEM.md` to onboard designers

Quick start (dev)
------------------
Install dependencies and run the existing Vite demo:

```bash
npm install
npm run dev
```

To try the Next.js migration scaffold:

```bash
cd migration/next-app
npm install
npm run dev
```

Technology stack & local dev (added)
----------------------------------
Проект использует следующий стек (MVP):

- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- DB: PostgreSQL + Prisma
- Auth: JWT (access + refresh)
- Containerization: Docker / docker-compose

Локальный запуск (MVP skeleton):

```bash
# из корня проекта
docker-compose up --build

# или локально для отдельных приложений
cd apps/backend && npm ci && npm run dev
cd apps/frontend && npm ci && npm run dev
```

Repository structure (selected)
------------------------------
- `src/` — original UI prototype and components
- `src/styles/` — design tokens and theme definitions
- `migration/next-app/` — Next.js 14 + TypeScript scaffold
- `DESIGN_SYSTEM.md` — design system documentation and Figma prompt
- `PR_DESCRIPTION.md` — summary of changes and testing guidance

Repository basics (checked):

- `README.md` — present
- `LICENSE` — present (MIT)
- `CONTRIBUTING.md` — present
- `.github/workflows/ci.yml` — CI workflow present
- `package.json` — present


Contributing
------------
If you want to contribute design or UI changes, please open a branch and create a PR with visual diff screenshots. Focus areas:
- Accessibility and contrasts
- Mobile/touch optimizations
- Animations and micro-interactions

License
-------
This repository is released under the MIT License. See `LICENSE` for details.

Contact
-------
For questions, open an issue or contact the maintainers.

