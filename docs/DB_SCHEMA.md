# Проектирование схемы БД (PostgreSQL)

Цель: описать основные сущности для MVP и их связи — `User`, `Course`, `Lesson`, `CTFChallenge`, `UserProgress`.

Модель `User`
- `id` UUID PK
- `email` String, unique, not null
- `passwordHash` String, not null
- `displayName` String (nullable)
- `role` Enum: [USER, ADMIN]
- `createdAt` timestamp
- `updatedAt` timestamp

Модель `Course`
- `id` UUID PK
- `title` String
- `slug` String unique
- `description` Text
- `published` Boolean
- `createdAt`, `updatedAt`

Модель `Lesson`
- `id` UUID PK
- `courseId` FK -> `Course.id`
- `title` String
- `content` Text (markdown/html)
- `order` Integer (позиция в курсе)
- `durationMinutes` Integer (опционально)
- `createdAt`, `updatedAt`

Модель `CTFChallenge`
- `id` UUID PK
- `title` String
- `description` Text
- `category` String
- `difficulty` Enum [Easy, Medium, Hard]
- `flagHash` String (хеш флага) — не хранить флаг в открытом виде
- `createdAt`, `updatedAt`

Модель `UserProgress`
- `id` UUID PK
- `userId` FK -> `User.id`
- `courseId` FK -> `Course.id` (nullable)
- `lessonId` FK -> `Lesson.id` (nullable)
- `progress` Integer (0-100)
- `completedAt` timestamp (nullable)
- `updatedAt` timestamp

Индексы и ограничения
- unique(email) на `User`
- unique(slug) на `Course`
- индекс по `userId` и `courseId` на `UserProgress` для быстрых выборок

Примеры use-cases
- Отметить урок как пройденный -> вставить/обновить `UserProgress` для `lessonId` и увеличить `progress` курса.
- Выдать сертификат -> агрегировать `UserProgress` по `courseId` и проверить `progress == 100`.

Рекомендации по миграциям
- Использовать Prisma или TypeORM; хранить миграции в `apps/backend/prisma/migrations`.
- Писать миграции атомарно и тестировать на dev контейнере Postgres.

Дальше
- После утверждения структуры — сгенерировать Prisma schema (`schema.prisma`) на основе этой модели и выполнить миграцию.
