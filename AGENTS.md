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

- `pnpm run check`
- `pnpm run format`

`pnpm run lint` — только после крупных изменений или по указанию пользователя.

Команды запускать через PowerShell с bypass (см. раздел "Команды").

Если `pnpm run check` выдает ошибки — исправить перед завершением.

**Важно:** Не использовать прямой вызов утилит (`npx`, `./node_modules/.bin` и т.д.) для проверки/валидации/линтинга. Если нужной команды нет в разделе `scripts` `package.json` — сообщить пользователю.

### 3. Импорты

- Типы через `import type`
- Иконки из `lucide-svelte`
- Путь `@/` для src

### 4. Компоненты

- Все callback пропсы (`on*`) называть с маленькой буквы (`onclose`, `onSave` → `onclose`, `onsave`), для консистентности с Svelte event handlers

### 5. Типизация

- По возможности использовать `interface`, а не `type`
- `type` только если необходимо (union, пересечения и т.д.)

### 6. Структура файлов

```
src/
├── lib/            # Утилиты, services, state
│   ├── state/     # Svelte state с runes (называть *.svelte.ts)
│   ├── services/  # Сервисы
│   ├── composables/ # Композаблы
│   └── *.ts       # Утилиты
├── components/     # Все Svelte компоненты
├── start/         # Стартовая страница (newtab)
└── popup/         # Popup окно
```

**Важно:** Все Svelte компоненты должны лежать в `src/components/`.

**Важно:** Файлы в `lib/state/` должны называться `*.svelte.ts`, т.к. используют Svelte runes (`$state`, `$derived`, `$effect`).

### 7. Конфиги

**КОНФИГИ МЕНЯТЬ ЗАПРЕЩЕНО.** Если нужно изменить конфиг (ESLint, Prettier, Stylelint и т.д.) — сначала спросить пользователя.

### 8. Комментарии

Минимум комментариев, только для сложных моментов или объяснения "почему". Обычный код не комментируем.

## Команды

Пакетный менеджер — **pnpm**. На Windows запускать через PowerShell с обходом политики выполнения:

```powershell
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; cd 'путь_к_проекту'; pnpm run <команда>"
```

```bash
pnpm run dev      # Dev сервер
pnpm run build    # Сборка (перезаписывает dist)
pnpm run check    # Проверка типов
pnpm run lint     # ESLint (только после крупных изменений)
pnpm run lint:css # Stylelint (CSS + Svelte)
pnpm run format   # Prettier
```

**Важно:** `pnpm run build` перезаписывает папку dist и может сломать работающий dev сервер. Использовать только для финальной сборки.
