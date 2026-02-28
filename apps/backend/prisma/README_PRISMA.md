
# Prisma schema and migration notes

This project uses Prisma with PostgreSQL. Key commands:

- Install deps: `npm ci` in `apps/backend`
- Run migration (dev): `npx prisma migrate dev --name init`
- Generate client: `npx prisma generate`
- Seed (if present): `node prisma/seed.js`

Current schema: `schema.prisma` defines `User`, `Course`, `Lesson`, `CTFChallenge`, `UserProgress`.
