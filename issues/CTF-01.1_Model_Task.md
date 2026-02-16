# CTF-01.1 — Модель задачи CTF и хранение флагов

Epic: CTF
Priority: Must
Estimate: 3ч

Описание:
- Модель задачи CTF с полями: id, title, description, flagHash, points, createdAt.
- Флаги хранятся в безопасном виде (хеш).

Критерии приёмки:
- Модель описана и есть пример в Prisma/schema.

Чеклист:
- [ ] Добавить модель CTFTask
- [ ] Документация по процессу хеширования флагов
