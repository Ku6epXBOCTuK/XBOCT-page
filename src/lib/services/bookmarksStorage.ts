import type { Column, Group, StorageJson } from "$lib/state/bookmarks.types";
import { COLUMNS_COUNT, STORAGE_KEY } from "$lib/state/bookmarks.types";
import { nanoid } from "nanoid";

export function getFaviconUrl(url: string): string {
	const base = chrome.runtime.getURL("/_favicon/");
	const faviconUrl = new URL(base);
	faviconUrl.searchParams.set("pageUrl", url);
	faviconUrl.searchParams.set("size", "32");
	return faviconUrl.toString();
}

export function generateDefaultColumns(): Column[] {
	return Array.from({ length: COLUMNS_COUNT }, (_, i) => ({
		id: nanoid(),
		order: i,
	}));
}

export function generateDefaultGroups(defaultColumns: Column[]): Group[] {
	return [
		{
			id: nanoid(),
			columnId: defaultColumns[0].id,
			order: 0,
			name: "XBOCT-page",
			icon: "code",
			bookmarks: [
				{
					id: nanoid(),
					title: "Repository",
					url: "https://github.com/Ku6epXBOCTuK/XBOCT-page",
					favicon: getFaviconUrl("https://github.com/Ku6epXBOCTuK/XBOCT-page"),
				},
			],
		},
	];
}

export function getDefaultData(): { columns: Column[]; groups: Group[] } {
	const columns = generateDefaultColumns();
	return { columns, groups: generateDefaultGroups(columns) };
}

export function ensureFourColumns(cols: Column[]): Column[] {
	if (cols.length >= COLUMNS_COUNT) return cols.slice(0, COLUMNS_COUNT);
	const needed = COLUMNS_COUNT - cols.length;
	return [
		...cols,
		...Array.from({ length: needed }, (_, i) => ({
			id: nanoid(),
			order: cols.length + i,
		})),
	];
}

export function ensureFavicon(groups: Group[]): Group[] {
	return groups.map((g) => ({
		...g,
		bookmarks: g.bookmarks.map((b) => ({
			...b,
			favicon: b.favicon || getFaviconUrl(b.url),
		})),
	}));
}

export function toJson(groups: Group[], columns: Column[]): StorageJson {
	return {
		version: 1,
		groups: groups.map((g) => ({
			column: columns.findIndex((c) => c.id === g.columnId),
			name: g.name,
			icon: g.icon,
			bookmarks: g.bookmarks.map((b) =>
				b.hidden ? [b.url, b.title, true] : [b.url, b.title],
			),
		})),
	};
}

export function groupsFromJson(data: StorageJson, columns: Column[]): Group[] {
	return data.groups.map((g) => {
		const columnIndex = g.column % COLUMNS_COUNT;
		return {
			id: nanoid(),
			columnId: columns[columnIndex]?.id || columns[0].id,
			order: 0,
			name: g.name,
			icon: g.icon,
			bookmarks: (g.bookmarks || []).map((b) => ({
				id: nanoid(),
				url: b[0] || "",
				title: b[1] || "",
				favicon: getFaviconUrl(b[0] || ""),
				hidden: b[2] === true || undefined,
			})),
		};
	});
}

export function fromJson(data: StorageJson): {
	columns: Column[];
	groups: Group[];
} {
	const columns = generateDefaultColumns();
	return { columns, groups: groupsFromJson(data, columns) };
}

export async function loadFromStorage(): Promise<StorageJson | undefined> {
	try {
		const result = await chrome.storage.sync.get(STORAGE_KEY);
		return result[STORAGE_KEY] as StorageJson | undefined;
	} catch (e) {
		console.error("[bookmarks] Storage load error:", e);
		return undefined;
	}
}

export async function saveToStorage(data: StorageJson): Promise<void> {
	try {
		await chrome.storage.sync.set({ [STORAGE_KEY]: data });
	} catch {
		// Ignore storage errors (e.g., in incognito)
	}
}
