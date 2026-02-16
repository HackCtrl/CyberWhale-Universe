ОТЧЁТ ПО СЕССИИ — AUTH (Prisma + endpoints)

Дата: 2026-02-12
Область: AUTH — регистрация и логин (backend)

Выполнено:
- Добавлена Prisma схема в `apps/backend/prisma/schema.prisma` (модель `User` и связанные модели).
- Добавлен seed-скрипт `apps/backend/prisma/seed.js` для тестового пользователя.
- В `apps/backend/package.json` добавлены зависимости: `@prisma/client`, `bcryptjs`, `dotenv`.
- Реализованы простые эндпоинты в `apps/backend/src/index.ts`:
  - `POST /api/auth/register` — регистрация (хеширование пароля, запись в БД).
  - `POST /api/auth/login` — логин (проверка пароля, JWT выдача).
- Добавлен `apps/backend/README.md` с инструкциями по миграции и seed.
- Создан скрипт импорта карточек Issues: `scripts/import_issues_to_github.js`.

Замечания и дальнейшие шаги:
- Для запуска локально: установить зависимости в `apps/backend` и выполнить миграцию/seed (инструкции в README).
- Следующий шаг: реализовать UI для регистрации/логина (`AUTH-01.4`) и покрыть endpoint тестами.

Проценты для Google-таблицы (обновлённые):
- `1.1.1` — 12%
- `1.1.2` — 12%
- `1.3` (инфраструктура) — 12% (внесён лог)

Файлы с результатами:
- `apps/backend/src/index.ts`
- `apps/backend/prisma/schema.prisma`
- `apps/backend/prisma/seed.js`
- `apps/backend/README.md`
- `scripts/import_issues_to_github.js`
- `issues/*.md`

