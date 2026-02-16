# AUTH-01.1 — Схема пользователей в БД (Prisma models)

Epic: Auth
Priority: Must
Estimate: 2ч

Описание:
- Создать модель `User` в Prisma schema с полями: id, email, passwordHash, createdAt, updatedAt, roles (опционально).

Критерии приёмки:
- Prisma schema содержит модель `User`.
- Модель покрыта базовой миграцией (описание в README), пример использования в `apps/backend`.

Чеклист:
- [ ] Добавить модель `User` в `schema.prisma`
- [ ] Добавить README с командой миграции
- [ ] Пример запроса создания пользователя (скрипт/seed)
