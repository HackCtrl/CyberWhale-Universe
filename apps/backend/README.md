Backend — локальная разработка

Шаги для настройки окружения (локально):

1) Установить зависимости в `apps/backend`:

```bash
cd apps/backend
npm install
```

2) Настроить переменную `DATABASE_URL` (Postgres). Пример .env:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/cyberwhale
```

3) Инициализировать миграцию и сгенерировать клиент Prisma:

```bash
npx prisma migrate dev --name init --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/schema.prisma
```

4) Запустить seed (создаст тестового пользователя):

```bash
node prisma/seed.js
```

5) Запустить dev-сервер:

```bash
npm run dev
```

Примечание: `prisma` и `@prisma/client` должны быть установлены в `dependencies`.
 
5) Postgres (локально через Docker)
1) Запустить локальный Postgres через docker-compose (файл `docker-compose.postgres.yml`):

```bash
cd apps/backend
docker compose -f docker-compose.postgres.yml up -d
```

2) Убедиться, что `apps/backend/.env` содержит корректный `DATABASE_URL`, по умолчанию:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cyberwhale_dev"
```

3) Применить миграции и сгенерировать клиент Prisma:

```bash
npx prisma migrate dev --name init --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/schema.prisma
```

4) Запустить seed и dev-сервер как описано выше.
