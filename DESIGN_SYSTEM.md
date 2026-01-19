# CyberWhale — Design System (Кратко)

Цель: сделать единообразную, доступную, адаптивную дизайн-систему для существующего проекта с тёмной темой и неоновыми акцентами.

## 1. Токены (существенное)

- Цвета:
  - `--background`: #0f1724
  - `--surface`: rgba(16,24,39,0.6)
  - `--foreground`: #e6e9ef
  - `--primary`: #9fef00 (neon)
  - `--secondary`: #3b82f6
  - `--success`: #34d399, `--warning`: #f59e0b, `--danger`: #ef4444
- Типографика:
  - `h1` 48 / 56
  - `h2` 36 / 44
  - `h3` 28 / 36
  - `h4` 20 / 28
  - `h5` 16 / 24
  - `h6` 14 / 20
  - `body` 16 / 24
  - `caption` 12 / 16
- Радиусы: единый базовый: `--radius: 8px` (sm:6 / md:8 / lg:12)
- Тени/Glow:
  - `--shadow-card`: 0 8px 24px rgba(2,6,23,0.6) + soft neon rim
  - `--glow-primary`: subtle neon green glow
- Motion:
  - fast: 120ms, medium: 240ms, slow: 420ms
  - easing: cubic-bezier(.2,.9,.3,1)
- Touch target: `--touch-target: 44px`

## 2. Компоненты — ключевые правила

- Кнопки: primary / secondary / ghost / danger — состояния default / hover / active / disabled / loading.
- Карточки: unified surface, rounded corners, `--shadow-card`, hover lift + glow accent.
- Формы: реал-тайм валидация, состояния error/success, явные подсказки, placeholder contrast.
- Progress bars: animated fill, color-coded status (green/yellow/red).

## 3. Accessibility (WCAG)

- Основной текст должен иметь контраст >= WCAG AAA vs `--background` (проверить; при необходимости светлее `--foreground`).
- Кнопки и интерактивные элементы: focus outline (`--ring`), hover визуализация, min touch target 44px.

## 4. Адаптивность

- Breakpoints: Desktop 1440+, Tablet 768, Mobile 375
- Упрощённая навигация на мобильных: иконки + выдвигающееся меню
- Шрифты и отступы уменьшаются по шкале 4px grid

## 5. Анимации (рекомендации)

- Fade-in: opacity 0 → 1, translateY 6px → 0, duration 240ms, ease `--motion-ease`.
- Hover card: scale(1.01), box-shadow -> `--shadow-elevated`, duration 120–180ms.
- Progress: linear animated width with CSS transition 420ms.
- Page transitions: fade + slide on route change (consistent timing).

## 6. Космические детали (visual)

- Едва заметные звёзды/туманности: low-contrast SVG layer на фоне (opacity 0.04–0.08).
- Световые акценты: легкий glow на `primary` кнопках.
- Орбитальные линии: тонкие SVG-лучи/контуры, 1–2 на экран, subtle.

## 7. Figma Prompt (готово для вставки)

ЗАДАЧА: УЛУЧШИТЬ СУЩЕСТВУЮЩИЙ ДИЗАЙН CYBERWHALE UNIVERSE — создать дизайн-систему и набор компонентов, сохранив тёмную тему и неоновые акценты.

Требования:
- Создать color palette: primary, secondary, background, text, accents.
- Определить типографику: h1–h6, body, caption с размерами и line-height.
- Сделать spacing system: 4px grid.
- Тени/эффекты: единые тени для карточек, glow-эффекты для акцентов.
- Создать компоненты: кнопки (варианты + состояния), карточки (единый стиль), формы (валидация, состояния).
- Анимации: fade-in, hover card, animated progress bars, page transitions.
- Адаптивность: Desktop 1440+, Tablet 768, Mobile 375 (touch targets >=44px).
- Accessibility: проверить контраст по WCAG AAA, обеспечить focus states.

Дополнительно: добавить нюансы «космической» графики — тонкие звёзды/туманности, орбитальные линии, световые акценты.

Цель: улучшить читабельность, единообразие и профессионализм интерфейса без радикальной перестройки концепции.

---

Если нужно, могу: экспортировать токены в JSON, сгенерировать ремиксы CSS/SCSS или подготовить готовые компоненты React (стили + состояния). Напишите, что делаем дальше.