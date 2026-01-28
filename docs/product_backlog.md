# Product Backlog — CyberWhale Universe (MoSCoW + estimates)

Версия: Week 2, Stage 1 — завершение первоначального Product Backlog и приоритизация (MoSCoW).

Формат: задача — краткое описание — приоритет (M/S/C/W) — оценка (story points) — критерий приёмки

---

## Must (M)

- Auth: регистрация, вход (email/password), восстановление пароля — M — 8 — Приёмка: пользователь может зарегистрироваться и войти.
- База данных: PostgreSQL схема для users/courses/lessons/enrollments/ctf — M — 5 — Приёмка: схема применима, дамп SQL есть (`db/schema.sql`).
- Core pages: Главная, Каталог курсов, Страница курса, ЛК — M — 8 — Приёмка: статические страницы и маршруты доступны.
- API skeleton (mock): эндпоинты для аутентификации и курсов (локально/mock) — M — 5 — Приёмка: mock ответы для UI.
- Репозиторий и структура проекта — M — 1 — Приёмка: репо в порядке, базовая структура.

## Should (S)

- CI: GitHub Actions: build + lint + artifact — S — 3 — Приёмка: workflow запускается и собирает проект.
- Docker Compose: Postgres + Adminer — S — 2 — Приёмка: `docker compose up -d` поднимает сервисы.
- Навигация и базовый layout (header/footer) — S — 3 — Приёмка: навигация видна и рабочая.

## Could (C)

- CTF basic: список задач и submission endpoint (mock) — C — 5 — Приёмка: задачи видны, submission сохраняется в mock.
- Лидерборд — C — 3 — Приёмка: простая таблица лидеров (mock).
- Простая интеграция AI‑agents: модель-конфиг + список агентов — C — 5 — Приёмка: CRUD‑интерфейс для агентов (mock).

## Won't (W) — в этом этапе

- Платежи, аналитика, production autoscaling — W — 0 — перенесено на последующие этапы.

---

## Epics (первичный мэппинг)

- Epic A: Core auth & user flows (Auth + DB users) — включает Auth, DB users, API skeleton — total ~14 SP
- Epic B: Courses & Learning (courses, lessons, enrollments, UI) — total ~13 SP
- Epic C: Platform infra (CI, docker, repo) — total ~6 SP
- Epic D: CTF & leaderboard (basic) — total ~8 SP

## Примечания по приоритизации

- На текущей неделе (Week 2) backlog доведён до состояния ready-to-implement: MoSCoW расставлен, минимальные оценки и эпики назначены.
- Следующие шаги: разбивка задач на конкретные тикеты (issues), назначение ответственных, оценка времени на спринт.

---

Файл ссылается на `db/schema.sql` и `docs/visual-designs/*` для связки UI и модели данных.
