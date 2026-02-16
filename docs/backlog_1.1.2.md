Product Backlog — версия 1.1.2
Дата: 2026-02-12

Что такое Product Backlog (для начинающего):
- Product Backlog — это упорядоченный список всех требований, функций и улучшений для продукта. В начале он содержат большие идеи (фичи), затем каждая фича разбивается на эпики и микрозадачи, которые можно поставить в спринт или сессию.
- Мы используем MoSCoW-приоритизацию: Must (обязательно), Should (важно), Could (можно), Won't (не в MVP).

Структура файла: id | Feature | Epic | Priority (MoSCoW) | Microtasks | Estimate

1. AUTH-01 | Регистрация и авторизация (email+пароль) | Auth | Must
  - Microtasks:
    - AUTH-01.1: Схема пользователей в БД (Prisma models) — 2ч
    - AUTH-01.2: Эндпоинт регистрации /api/auth/register — 3ч
    - AUTH-01.3: Эндпоинт логина /api/auth/login (+JWT) — 3ч
    - AUTH-01.4: UI: формы регистрации/входа — 4ч
  - Estimate total: 12ч

2. PROFILE-01 | Личный кабинет: прогресс и курсы | UI | Must
  - Microtasks:
    - PROFILE-01.1: API получения прогресса — 2ч
    - PROFILE-01.2: UI: страница профиля с прогресс-баром — 4ч
  - Estimate total: 6ч

3. COURSES-01 | Модель курса / урока в БД | Core | Must
  - Microtasks:
    - COURSES-01.1: Prisma models: Course, Lesson, UserProgress — 3ч
    - COURSES-01.2: CRUD API для курсов (read-only MVP) — 4ч
  - Estimate total: 7ч

4. CTF-01 | Минимальная CTF-платформа (создание задач, проверка флагов) | Core | Must
  - Microtasks:
    - CTF-01.1: Модель задачи CTF, хранение флагов (secure) — 3ч
    - CTF-01.2: Эндпоинт проверки флага — 2ч
    - CTF-01.3: UI: список задач и страница задачи — 4ч
  - Estimate total: 9ч

5. INFRA-01 | Docker + CI для сборки и деплоя | Infra | Must
  - Microtasks:
    - INFRA-01.1: Dockerfile для backend/frontend — 2ч
    - INFRA-01.2: Простая CI workflow (build & test) — 3ч
  - Estimate total: 5ч

6. CERT-01 | Генерация сертификатов (PDF) | Aux | Should
  - Microtasks:
    - CERT-01.1: endpoint генерации PDF — 3ч
  - Estimate total: 3ч

7. CHAT-01 | Интеграция с GigaChat | Integrations | Should
  - Microtasks:
    - CHAT-01.1: Пуллинг/интеграция API — 4ч
  - Estimate total: 4ч

8. CATALOG-01 | Каталог курсов с фильтрацией | UI | Should
  - Microtasks:
    - CATALOG-01.1: API выдачи списка курсов — 3ч
    - CATALOG-01.2: UI: каталог/фильтры — 4ч
  - Estimate total: 7ч

9. SUGGESTIONS-01 | Система подсказок для CTF | UX | Could
  - Microtasks:
    - SUGGESTIONS-01.1: Модель подсказки + UI — 4ч
  - Estimate total: 4ч

Примечание по приоритизации:
- Первые 5 пунктов должны попасть в MVP (Must). Остальное — позже или при наличии ресурсов.

Дальшие шаги (в рамках сессии 1.1.2):
- Уточнить и согласовать список Must — оставить минимум для работы первого релиза.
- Разбить Must на микрозадачи и создать карточки/issue-шаблоны (опционально: `scripts/create_issue_template.js`).
- Зафиксировать итоговый объём и обновить `gantt_state.json` notes для `1.1.2` (без изменения прогресса сейчас).

Файл с этим backlog добавлен как `docs/backlog_1.1.2.md`.
