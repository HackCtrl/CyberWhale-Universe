# ADR 0001: Technology stack and high-level architecture

Дата: 2026-02-11

Контекст
-------
Нужно быстро и предсказуемо реализовать MVP платформы CyberWhale Universe, опираясь на уже выбранный стек: Next.js 14, TypeScript, Tailwind CSS; Node.js, Express, PostgreSQL, Prisma; Docker.

Решение
------
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
  - Причины: SSR/SSG гибкость, встроенный роутинг, поддержка современных фич Next.js 14.
- Backend: Node.js + Express + TypeScript
  - Причины: простота, совместимость с existing tooling, лёгкость интеграции с Prisma.
- DB: PostgreSQL, ORM: Prisma
  - Причины: типизация, миграции, производительность.
- Аутентификация: JWT (access + refresh)
- AI-интеграция: внешний GigaChat API через отдельный сервис-клиент с кэшем ответов.
- Контейнеризация: Docker + docker-compose для локального dev; продакшен — Docker + Nginx reverse proxy

High-level архитектура
--------------------
- Next.js (frontend)
  - Коммуникация: REST API к Backend
- Backend (Express)
  - Роуты: /auth, /api/courses, /api/ctf, /api/progress
  - Сервис для интеграции с GigaChat
- DB: PostgreSQL (Prisma schema в `db/prisma/schema.prisma`)
- CI/CD: GitHub Actions — тесты, lint, build, deploy (при наличии секретов)

Принятые решения и ограничения
-----------------------------
- Пропускаем развертывание тестового сервера (Yandex Cloud) и домен/SSL до появления бюджета.
- Фокус на минимальном рабочем фичсете: регистрация/вход, просмотр каталога курсов, базовый CTF листинг и проверка флагов.

Следующие шаги
--------------
1. Добавить `docs/adr/0001-technology-stack.md` (этот документ).
2. Создать базовые `apps/frontend` и `apps/backend` с минимальными `package.json`.
3. Обновить `README.md` секцией "Технологический стек и запуск".
