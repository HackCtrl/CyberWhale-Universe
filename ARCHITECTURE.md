# ARCHITECTURE — CyberWhale Universe (MVP)

Дата: 10.02.2026

Цель файла: зафиксировать выбранный стек, высокоуровневую архитектуру и обоснования для MVP, чтобы можно было воспроизвести и объяснить решение инвестору.

1) Выбранный стек (фиксировано)
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- Backend: Node.js + Express
- БД: PostgreSQL + Prisma (ORM)
- Аутентификация: JWT (email + пароль)
- DevOps / Контейнеризация: Docker, Nginx (на проде)
- Облако/хостинг: Yandex Cloud (VM / managed Postgres) или VPS
- CI/CD: GitHub Actions
- Дополнительно: Sentry (ошибки), Yandex.Metrica (аналитика), GigaChat API (интеграция ИИ)

Почему так:
- Next.js даёт SSR/ISR и удобную структуру страниц для MVP.
- TypeScript повышает устойчивость к ошибкам и читаемость кода.
- Tailwind ускоряет верстку и согласованность с дизайн-системой.
- Node + Express — лёгкий и привычный backend для быстрого прототипирования.
- PostgreSQL — реляционная, подходит для данных курсов/пользователей/CTF.
- Prisma упрощает миграции и типобезопасный доступ к БД.
- Docker обеспечивает одинаковую среду разработки и продакшена.

2) Высокоуровневая архитектура
- Клиент (Next.js) ↔ HTTP API (Express)
- API ↔ БД (Prisma / PostgreSQL)
- API ↔ Внешние сервисы: GigaChat (ИИ), почта (SMTP), хранилище файлов (Yandex Object Storage)
- Auth: JWT + refresh tokens, middleware проверки прав
- CI: тесты → build → Docker image → deploy to staging/production

Компоненты и границы ответственности:
- Frontend: рендеринг страниц, маршрутизация, клиентская логика, вызовы API, обработка состояний
- Backend: REST/GraphQL API, бизнес-логика, валидация, генерация сертификатов (PDF), проверка флагов CTF
- DB: хранение сущностей User, Course, Lesson, CTFChallenge, UserProgress
- Интеграции: отправка почты, GigaChat, мониторинг

3) Предлагаемая структура репозитория

- /apps/frontend — Next.js приложение
- /apps/backend — Express + TypeScript API
- /infra — Docker, nginx, compose, kubernetes manifests (если потребуется)
- /db — миграции Prisma, схемы
- /docs — диаграммы, ARCHITECTURE.md, Product Backlog

4) CI/CD и ветвление
- Ветки: main (production), staging, dev (feature branches -> PR)
- GitHub Actions: lint, typecheck, unit tests, build image, push to registry, deploy to staging

5) Деплой (кратко)
- Сборка Docker-образов для frontend и backend
- Развертывание на Yandex Cloud VM / managed services или на VPS под nginx
- Настройка managed Postgres или контейнер с Postgres (для MVP можно использовать managed)

6) Безопасность и мониторинг (коротко)
- HTTPS (SSL) — настроить на этапе продакшена
- Sentry для ошибок, Yandex.Metrica для аналитики
- Бэкапы БД и мониторинг доступности

7) Что сделано в этой сессии и зачем
- Зафиксирован стек технологий и ключевые решения (позволяет начать реализацию и согласовать ожидания).
- Набросана высокоуровневая архитектура и границы сервисов (чтобы понимать какие сервисы собирать, где хранить данные и как интегрировать ИИ).
- Создана базовая рекомендуемая структура репозитория и CI-процесс (чтобы быстро перейти к инициализации проектов и автоматическому деплою).

8) Что осталось сделать по задаче 1.1.1
- Подготовить шаблоны конфигураций: Dockerfile, docker-compose.yml, prisma/schema.prisma, базовый next.config.js и tsconfig.json.
- Описать пример flow CI (workflow YAML).
- Согласовать детали деплоя (Yandex Cloud: VM vs managed services).

9) Следующие шаги (рекомендация на следующую сессию)
1. Завершить задачу 1.1.1 до 60-75%: добавить примеры конфигов и базовые шаблоны проектов (frontend & backend).
2. Начать задачу 1.1.2 (Product Backlog) после этого.

---
Файл создан автоматически в сессии 10.02.2026.
