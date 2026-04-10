# Agents Guidelines

## Проект: XBOCT-page

Chrome расширение со стартовой страницей для управления закладками.

## Стек

- **Svelte 5** (только runes-режим)
- TypeScript
- Vite + CRXJS
- ESLint + Prettier

## Правила

### 1. Svelte 5

Использовать только Svelte 5 синтаксис:

- `$state()` вместо `let` для реактивных переменных
- `$derived()` вместо `$:` для вычисляемых значений
- `$effect()` вместо lifecycle функции
- `$props()` для получения пропсов в компонентах

### 2. Проверка кода

После завершения любой задачи **всегда** выполнять:

```bash
npm run check
npm run format
npm run lint
```

Если `npm run check` выдает ошибки — исправить перед завершением.

**Порядок:** check -> format -> lint (сначала проверка типов, затем форматирование, затем линтер).

**Важно:** Не использовать прямой вызов утилит (`npx`, `./node_modules/.bin` и т.д.) для проверки/валидации/линтинга. Если нужной команды нет в разделе `scripts` `package.json` — сообщить пользователю.

### 3. Импорты

- Типы через `import type`
- Иконки из `lucide-svelte`
- Путь `@/` для src

### 4. Структура файлов

```
src/
├── types/          # TypeScript интерфейсы
├── lib/            # Утилиты, services
├── components/      # Переиспользуемые компоненты
├── start/          # Стартовая страница (newtab)
└── popup/          # Popup окно
```

## Команды

```bash
npm run dev     # Dev сервер
npm run build   # Сборка
npm run check   # Проверка типов
npm run lint    # ESLint
npm run format  # Prettier
```
