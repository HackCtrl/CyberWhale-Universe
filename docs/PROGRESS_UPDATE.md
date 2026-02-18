# Обновление прогресса (Progress update)

Кратко: этот документ описывает безопасный, повторяемый процесс обновления прогресса задач в проекте и как фиксировать изменения в репозитории.

Файлы и расположения
- Основной источник правды диаграммы Ганта: `gantt_state.json` (корень проекта).
- Резервные копии: `backups_archive/gantt_state.json.bak.*`.
- Иммутабельный лог обновлений прогресса: `tracking/progress_log.json`.

Основные принципы
- Всегда делайте резервную копию перед массовыми изменениями (скрипты автоматически архивируют).
- Обновление прогресса должно сопровождаться записью в `tracking/progress_log.json` с объяснением (who/what/why/timestamp).
- Не коммитьте `node_modules` или другие зависимости — используйте `.gitignore`.

Ручной рабочий процесс (шаги)
1. Выбрать задачу локально (используйте скрипт выбора задач):
   - `node gantt-tools/scripts/normalize_gantt.js` — (если нужно) нормализовать локальную копию.
   - `node scripts/select_task.js` — получить предложение, чем заняться (если доступен).
2. Внести изменение процента в `gantt_state.json` для конкретного `taskId`.
3. Добавить запись в `tracking/progress_log.json`. Запись должна содержать:
   - `taskId` — идентификатор задачи
   - `oldProgress` — предыдущее значение
   - `newProgress` — новое значение
   - `author` — github/login или имя
   - `message` — короткое объяснение
   - `timestamp` — ISO 8601
   Пример записи:
   ```json
   {
     "taskId": "1.2.1",
     "oldProgress": 12,
     "newProgress": 24,
     "author": "kirill",
     "message": "Completed wireframe for Today page",
     "timestamp": "2026-02-18T12:34:56Z"
   }
   ```
4. Локальная валидация:
   - Запустите тесты/линтинг, если применимо.
   - Прогляньте `git status`.
5. Коммит и пуш (правила коммита):
   - Сообщение коммита: `chore(progress): TASKID newProgress% — краткое сообщение`
   - Пример:
     ```bash
     git add gantt_state.json tracking/progress_log.json
     git commit -m "chore(progress): 1.2.1 24% — wireframe done"
     git push origin HEAD
     ```

Автоматизация (рекомендуется)
- Скрипт обновления (рекомендуем вызвать): `node scripts/update_progress.js --task 1.2.1 --progress 24 --message "wireframe done"`
- Скрипт должен:
  - Проверить текущий `gantt_state.json` и вернуть `oldProgress`.
  - Обновить `gantt_state.json` и добавить запись в `tracking/progress_log.json` атомарно.
  - Опционально: создавать резервную копию в `backups_archive/`.

Проверка на CI
- Workflows настроены для `push` по веткам `master/main` и по путям `apps/backend/**`, `mvp-starter/**`.
- После пуша убедитесь, что GitHub Actions запустился: https://github.com/HackCtrl/CyberWhale-Universe/actions

Полезные заметки
- Если нужно отменить ошибочный коммит — используйте `git revert` вместо `git reset` для публичных веток.
- Для удаления больших объектов из истории (если случайно попали) используйте `git filter-repo` или `BFG`, согласовав force-push с командой.

Контакты
- Если возникают вопросы по процессу — открой issue `PROCESS-01` в репозитории и пометь `team/backend`.

---
Файл сгенерирован автоматически помощником; при изменениях обновите этот документ.
