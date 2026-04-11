# TODO: Стартовая страница с закладками

## 1. Типы данных

**Создать `src/types/bookmarks.ts`:**

```typescript
import { nanoid } from "nanoid";

export interface Bookmark {
	id: string;
	title: string;
	url: string;
	favicon?: string;
	createdAt: number;
}

export interface Group {
	id: string;
	columnId: string; // ссылка на колонку
	order: number; // порядок внутри колонки
	name: string;
	bookmarks: Bookmark[];
}

export interface Column {
	id: string;
	order: number;
}

export interface BookmarkData {
	columns: Column[];
	groups: Group[];
	version: number; // для миграций
}

export const DEFAULT_COLUMNS: Column[] = [
	{ id: nanoid(), order: 0 },
	{ id: nanoid(), order: 1 },
	{ id: nanoid(), order: 2 },
];
```

---

## 2. Storage Service

**Создать `src/lib/storage.ts`:**

```typescript
import type { BookmarkData } from "@/types/bookmarks";

const STORAGE_KEY = "bookmarks";

export async function getBookmarks(): Promise<BookmarkData>;
export async function setBookmarks(data: BookmarkData): Promise<void>;
export async function getStorageUsage(): Promise<{
	used: number;
	limit: number;
	percent: number;
}>;
export function isStorageNearLimit(): Promise<boolean>;
```

**Функции:**

- `getBookmarks()` — получить все данные
- `setBookmarks(data)` — сохранить данные
- `getStorageUsage()` — получить { used, limit, percent }
- `isStorageNearLimit()` — true если > 80%

---

## 3. Утилиты

**Создать `src/lib/bookmarks.ts`:**

```typescript
import { nanoid } from "nanoid";
import type { Bookmark, Group, Column, BookmarkData } from "@/types/bookmarks";

export function createBookmark(title: string, url: string): Bookmark;
export function createGroup(name: string, columnId: string): Group;
export function createColumn(): Column;
export function exportToJson(data: BookmarkData): string;
export function importFromJson(json: string): BookmarkData;
export function reorderColumns(
	columns: Column[],
	fromIndex: number,
	toIndex: number,
): Column[];
export function reorderGroups(
	groups: Group[],
	columnId: string,
	fromIndex: number,
	toIndex: number,
): Group[];
```

---

## 4. UI компоненты

```
src/components/
├── Column.svelte              # Колонка с виджетами
├── BookmarkWidget.svelte       # Виджет одной группы
├── BookmarkList.svelte        # Список закладок в виджете
├── AddGroupModal.svelte        # Модалка добавления группы
├── AddBookmarkModal.svelte    # Модалка добавления закладки
├── StorageWarning.svelte       # Предупреждение о заполненности
└── EmptyState.svelte          # Состояние когда нет закладок
```

**Каждый компонент:**

- Column — контейнер для виджетов в одной колонке, drag & drop для перемещения виджетов
- BookmarkWidget — название группы, список закладок, кнопки редактирования
- BookmarkList — закладки с иконкой сайта и названием
- AddGroupModal — инпут для названия группы, выбор колонки
- AddBookmarkModal — инпуты URL и title
- StorageWarning — показывать если > 80%

---

## 5. Логика приложения (Svelte 5 runes)

**В `src/start/App.svelte`:**

```typescript
let columns = $state<Column[]>([]);
let groups = $state<Group[]>([]);
let storageWarning = $state(false);

$effect(() => {
	loadBookmarks();
	checkStorageUsage();
});
```

**Функции:**

- `loadBookmarks()` — загрузить из storage
- `saveBookmarks()` — сохранить в storage
- `addColumn()` — добавить колонку
- `deleteColumn(id)` — удалить колонку
- `addGroup(name, columnId)` — добавить группу
- `deleteGroup(id)` — удалить группу
- `moveGroup(groupId, newColumnId, newOrder)` — переместить группу между колонками
- `addBookmark(groupId, title, url)` — добавить закладку
- `deleteBookmark(groupId, bookmarkId)` — удалить закладку
- `checkStorageUsage()` — проверить заполненность

---

## 6. Drag & Drop

**Библиотеки для рассмотрения:**

- `svelte-dnd-action` — популярная библиотека для Svelte
- Нативный HTML5 Drag & Drop API

**Нужно реализовать:**

- Перетаскивание виджетов внутри колонки
- Перетаскивание виджетов между колонками

---

## 7. Popup

**Функционал popup:**

- Добавить текущую страницу в закладки
- Показать последние N закладок
- Кнопка "Открыть стартовую страницу"

---

## 8. Импорт/Экспорт

**Export:**

- Кнопка в UI → формирует JSON → скачивает файл `bookmarks-{date}.json`

**Import:**

- Кнопка в UI → file input → парсит JSON → предлагает merge или replace

---

## Файлы для создания

```
src/
├── types/
│   └── bookmarks.ts
├── lib/
│   ├── storage.ts
│   └── bookmarks.ts
├── components/
│   ├── Column.svelte
│   ├── BookmarkWidget.svelte
│   ├── BookmarkList.svelte
│   ├── AddGroupModal.svelte
│   ├── AddBookmarkModal.svelte
│   ├── StorageWarning.svelte
│   └── EmptyState.svelte
└── start/
    └── App.svelte  (переработать)
```

---

## Готовые зависимости

- nanoid ✅
- Lucide (через unplugin-icons) — добавить позже
- svelte-dnd-action — для drag & drop (опционально)

## Селектор иконок

- Установить данные иконок: npm install -D @iconify-json/lucide (чтобы получить список имен в виде JSON).
- Установить динамический компонент: npm install -D @iconify/svelte (он умеет рендерить иконку просто по строковому имени lucide:name).
- Логика селектора:Импортировать ключи из JSON: Object.keys(lucideData.icons).
- Запустить поиск/фильтрацию по этому массиву строк.
- Выводить результат через <Icon icon="lucide:{name}" />.
- Оптимизация: Использовать пагинацию или виртуальный скролл, так как иконок больше 1000, и обычный {#each} может лагать.

## Как синхронизировать данные

Синхронизация через GitHub Gist — это популярный «хакерский» способ обойти ограничения Chrome, и он действительно рабочий, но имеет свои нюансы.

### Как это устроено

Вы используете Gist как удаленный JSON-файл. Расширение авторизуется через GitHub, создает (или обновляет) секретный Gist и записывает туда ваш массив.
Плюсы:

- Огромный лимит: До 1 МБ на один файл внутри Gist. Это в 125 раз больше, чем лимит одного ключа в sync.
- Бесплатно: Вам не нужно платить за базу данных.
- Версионность: GitHub хранит историю изменений, так что данные можно "откатить". [1, 2]

Минусы и риски:

- Сложность: Нужно реализовать OAuth-авторизацию, чтобы получить токен пользователя, либо просить пользователя создать и вставить Personal Access Token вручную.
- Безопасность: Секретные Gists на самом деле не зашифрованы — они просто скрыты из общего поиска. Если кто-то узнает ID гиста, он увидит данные.
- Лимиты API: У GitHub есть ограничения на количество запросов (обычно 5000 в час для авторизованных пользователей), чего с запасом хватит для расширения, если не сохранять данные каждую секунду. [3, 4, 5, 6]

### Альтернативный «золотой стандарт»

Если вам кажется, что GitHub — это слишком сложно, посмотрите на Google Drive API.
Многие расширения создают скрытую папку в Google Drive пользователя (App Data folder).

- Пользователю не нужно создавать аккаунт (он уже вошел в Chrome).
- Места — гигабайты.
- Данные полностью приватны.

### Итог: что выбрать?

1.  Если данных < 100 КБ: Оставайтесь на chrome.storage.sync, но сжимайте данные (убирайте лишние ключи, сокращайте названия).
2.  Если нужно хранить много (МБ) и важна синхронизация:

- Gist — если ваша аудитория разработчики (им привычен GitHub).
  - Google Drive — если расширение для обычных пользователей.

3.  Если синхронизация не критична: Переходите на chrome.storage.local + разрешение "unlimitedStorage".
