ОТЧЁТ ПО СЕССИИ — Завершение Auth (01.2, 01.3, 01.4)

Дата: 2026-02-12
Выполненные задачи:
- AUTH-01.2 — Эндпоинт регистрации `/api/auth/register` — завершено (валидация, обработка ошибок, логика хеширования пароля).
- AUTH-01.3 — Эндпоинт логина `/api/auth/login` — завершено (проверка пароля, JWT выдача).
- AUTH-01.4 — UI: страницы регистрации и входа — созданы простые формы в `mvp-starter/app/register` и `mvp-starter/app/login`.

Что сделано детально:
- `apps/backend/src/index.ts`: улучшена валидация входных данных, добавлена обработка ошибок и JWT.
- `apps/backend/prisma/seed.js`: оставлен seed для тестирования.
- `mvp-starter/app/register/page.tsx` и `mvp-starter/app/login/page.tsx`: простые формы, отправляющие запросы на backend.
- Обновлён `tracking/progress_log.json`: добавлены записи для `AUTH-01.2`, `AUTH-01.3`, `AUTH-01.4` (по 12% каждая).

Проценты для Google-таблицы (итог за сегодня):
- `AUTH-01.2` — 12%
- `AUTH-01.3` — 12%
- `AUTH-01.4` — 12%

Дальше рекомендую:
- Прогнать локальные миграции и seed, запустить `apps/backend` и протестировать формы вручную.
- Добавить тесты (supertest/jest) и более подробную обработку ошибок/логирование.

Файлы: см. `apps/backend/src/index.ts`, `mvp-starter/app/register/page.tsx`, `mvp-starter/app/login/page.tsx`.
