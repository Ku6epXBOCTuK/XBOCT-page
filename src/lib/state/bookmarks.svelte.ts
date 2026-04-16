import { nanoid } from "nanoid";
import { parseNetscapeHtml } from "$lib/services/bookmarks";

export interface Bookmark {
	id: string;
	title: string;
	url: string;
	favicon: string;
}

export interface Group {
	id: string;
	columnId: string;
	order: number;
	name: string;
	icon?: string;
	bookmarks: Bookmark[];
}

export interface Column {
	id: string;
	order: number;
}

interface GroupJson {
	column: number;
	name: string;
	icon?: string;
	bookmarks: [string, string][];
}

interface StorageJson {
	version: number;
	groups: GroupJson[];
}

const STORAGE_KEY = "bookmarks";
const COLUMNS_COUNT = 4;

function getFaviconUrl(url: string): string {
	const base = chrome.runtime.getURL("/_favicon/");
	const faviconUrl = new URL(base);
	faviconUrl.searchParams.set("pageUrl", url);
	faviconUrl.searchParams.set("size", "32");
	return faviconUrl.toString();
}

function generateDefaultColumns(): Column[] {
	return Array.from({ length: COLUMNS_COUNT }, (_, i) => ({
		id: nanoid(),
		order: i,
	}));
}

function generateDefaultGroups(defaultColumns: Column[]): Group[] {
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

function getDefaultData(): { columns: Column[]; groups: Group[] } {
	const defaultColumns = generateDefaultColumns();
	const defaultGroups = generateDefaultGroups(defaultColumns);
	return {
		columns: defaultColumns,
		groups: defaultGroups,
	};
}

function ensureFourColumns(cols: Column[]): Column[] {
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

function ensureFavicon(groups: Group[]): Group[] {
	return groups.map((g) => ({
		...g,
		bookmarks: g.bookmarks.map((b) => ({
			...b,
			favicon: b.favicon || getFaviconUrl(b.url),
		})),
	}));
}

function toJson(groups: Group[], columns: Column[]): StorageJson {
	return {
		version: 1,
		groups: groups.map((g) => ({
			column: columns.findIndex((c) => c.id === g.columnId),
			name: g.name,
			icon: g.icon,
			bookmarks: g.bookmarks.map((b) => [b.url, b.title]),
		})),
	};
}

function fromJson(data: StorageJson): { columns: Column[]; groups: Group[] } {
	const columns = generateDefaultColumns();

	const groups: Group[] = data.groups.map((g) => {
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
			})),
		};
	});

	return { columns, groups };
}

interface BookmarksState {
	getColumns(): Column[];
	getGroups(): Group[];
	updateGroup(updatedGroup: Group): void;
	deleteGroup(id: string): void;
	moveGroup(groupId: string, targetColumnId: string, targetIndex: number): void;
	moveBookmark(
		bookmarkId: string,
		fromGroupId: string,
		toGroupId: string,
		toIndex: number,
	): void;
	getTotalBookmarks(): number;
	load(): Promise<void>;
	exportJson(compressed?: boolean): void;
	importJson(file: File): Promise<boolean>;
	importNetscapeHtml(file: File): Promise<boolean>;
	getFaviconUrl(url: string): string;
}

function createBookmarksState(): BookmarksState {
	const defaultData = getDefaultData();
	let columns = $state<Column[]>(defaultData.columns);
	let groups = $state<Group[]>(defaultData.groups);

	async function saveToStorage() {
		try {
			const data = toJson(groups, columns);
			console.log(
				"[bookmarks] Saved:",
				JSON.stringify(data, null, 2).slice(0, 60) + "...",
			);
			await chrome.storage.sync.set({
				[STORAGE_KEY]: data,
			});
		} catch {
			// Ignore storage errors (e.g., in incognito)
		}
	}

	async function loadFromStorageAction(): Promise<void> {
		try {
			const result = await chrome.storage.sync.get(STORAGE_KEY);
			const data = result[STORAGE_KEY] as StorageJson | undefined;
			console.log(
				"[bookmarks] Storage data:",
				data
					? JSON.stringify(data, null, 2).slice(0, 500) + "..."
					: "undefined",
			);

			if (data && data.groups) {
				const loaded = fromJson(data);
				columns = loaded.columns;
				groups = loaded.groups;
			} else {
				columns = ensureFourColumns(columns);
				groups = ensureFavicon(groups);
			}

			console.log("[bookmarks] Loaded columns:", $state.snapshot(columns));
			console.log("[bookmarks] Loaded groups:", $state.snapshot(groups));
		} catch (e) {
			console.error("[bookmarks] Storage error:", e);
		}
	}

	function updateGroup(updatedGroup: Group) {
		columns = columns;
		groups = groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
		saveToStorage();
	}

	function deleteGroup(id: string) {
		columns = columns;
		groups = groups.filter((g) => g.id !== id);
		saveToStorage();
	}

	function moveGroup(
		groupId: string,
		targetColumnId: string,
		targetIndex: number,
	) {
		console.log("[bookmarks] moveGroup", {
			groupId,
			targetColumnId,
			targetIndex,
		});
		const group = groups.find((g) => g.id === groupId);
		if (!group) {
			console.log("[bookmarks] group not found:", groupId);
			return;
		}

		const sourceColumnId = group.columnId;
		console.log("[bookmarks] source column:", sourceColumnId);

		if (sourceColumnId === targetColumnId) {
			const columnGroups = groups
				.filter((g) => g.columnId === sourceColumnId)
				.toSorted((a, b) => a.order - b.order);
			const sourceIndex = columnGroups.findIndex((g) => g.id === groupId);
			console.log("[bookmarks] source index:", sourceIndex);
			const moved = columnGroups.splice(sourceIndex, 1)[0];
			columnGroups.splice(targetIndex, 0, moved);
			groups = groups.map((g) => {
				const idx = columnGroups.findIndex((cg) => cg.id === g.id);
				return idx >= 0 ? { ...g, order: idx } : g;
			});
		} else {
			const sourceColumnGroups = groups
				.filter((g) => g.columnId === sourceColumnId)
				.toSorted((a, b) => a.order - b.order);
			const sourceIndex = sourceColumnGroups.findIndex((g) => g.id === groupId);
			console.log("[bookmarks] source index:", sourceIndex);
			const moved = sourceColumnGroups.splice(sourceIndex, 1)[0];

			const targetColumnGroups = groups
				.filter((g) => g.columnId === targetColumnId)
				.toSorted((a, b) => a.order - b.order);
			targetColumnGroups.splice(targetIndex, 0, moved);

			groups = groups.map((g) => {
				if (g.id === moved.id) {
					return { ...g, columnId: targetColumnId };
				}
				if (g.columnId === sourceColumnId) {
					const idx = sourceColumnGroups.findIndex((cg) => cg.id === g.id);
					return idx >= 0 ? { ...g, order: idx } : g;
				}
				if (g.columnId === targetColumnId) {
					const idx = targetColumnGroups.findIndex((cg) => cg.id === g.id);
					return idx >= 0 ? { ...g, order: idx } : g;
				}
				return g;
			});
		}

		columns = columns;
		saveToStorage();
	}

	function moveBookmark(
		bookmarkId: string,
		fromGroupId: string,
		toGroupId: string,
		toIndex: number,
	) {
		const fromGroup = groups.find((g) => g.id === fromGroupId);
		const toGroup = groups.find((g) => g.id === toGroupId);
		if (!fromGroup || !toGroup) return;

		const bookmark = fromGroup.bookmarks.find((b) => b.id === bookmarkId);
		if (!bookmark) return;

		if (fromGroupId === toGroupId) {
			const idx = fromGroup.bookmarks.findIndex((b) => b.id === bookmarkId);
			const moved = fromGroup.bookmarks.splice(idx, 1)[0];
			fromGroup.bookmarks.splice(toIndex, 0, moved);
			groups = groups.map((g) => (g.id === fromGroupId ? { ...g } : g));
		} else {
			fromGroup.bookmarks = fromGroup.bookmarks.filter(
				(b) => b.id !== bookmarkId,
			);
			toGroup.bookmarks.splice(toIndex, 0, bookmark);
			groups = groups.map((g) => {
				if (g.id === fromGroupId || g.id === toGroupId) {
					return { ...g };
				}
				return g;
			});
		}

		saveToStorage();
	}

	function getTotalBookmarks(): number {
		if (!Array.isArray(groups)) return 0;
		return groups.reduce((acc, g) => acc + g.bookmarks.length, 0);
	}

	function exportJson(compressed = false) {
		const data = toJson(groups, columns);
		const json = compressed
			? JSON.stringify(data)
			: JSON.stringify(data, null, 2);
		console.log(
			"[bookmarks] Exporting:",
			JSON.stringify(data, null, 2).slice(0, 500) + "...",
		);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "bookmarks.json";
		a.click();
		URL.revokeObjectURL(url);
		console.log("[bookmarks] Export done");
	}

	async function importJson(file: File): Promise<boolean> {
		try {
			const text = await file.text(); // Read file content as text
			const data = JSON.parse(text) as StorageJson; // Parse text as JSON and cast to StorageJson type
			console.log("[bookmarks] Importing:", text.slice(0, 500) + "..."); // Log first 500 chars of imported data
			if (!data.version || !data.groups) {
				console.log("[bookmarks] Import failed: invalid format");
				return false;
			}

			const existingColumns = columns;

			groups = data.groups.map((g) => {
				const columnIndex = g.column % COLUMNS_COUNT;
				return {
					id: nanoid(),
					columnId:
						existingColumns[columnIndex]?.id || existingColumns[0]?.id || "",
					order: 0,
					name: g.name,
					icon: g.icon,
					bookmarks: (g.bookmarks || []).map((b) => ({
						id: nanoid(),
						url: b[0] || "",
						title: b[1] || "",
						favicon: getFaviconUrl(b[0] || ""),
					})),
				};
			});

			await saveToStorage();
			console.log("[bookmarks] Import done, groups:", groups.length);
			return true;
		} catch (e) {
			console.error("[bookmarks] Import error:", e);
			return false;
		}
	}

	async function importNetscapeHtml(file: File): Promise<boolean> {
		try {
			const parsed = await parseNetscapeHtml(file);
			if (parsed.length === 0) {
				console.log("[bookmarks] No groups found in HTML");
				return false;
			}

			const columnsCount = columns.length;
			const groupsPerColumn = Math.ceil(parsed.length / columnsCount);

			groups = parsed.map((g, idx) => ({
				id: nanoid(),
				columnId:
					columns[Math.floor(idx / groupsPerColumn)]?.id || columns[0].id,
				order: 0,
				name: g.name,
				bookmarks: g.bookmarks.map((b) => ({
					id: nanoid(),
					url: b[0],
					title: b[1],
					favicon: getFaviconUrl(b[0]),
				})),
			}));

			await saveToStorage();
			console.log("[bookmarks] Netscape import done, groups:", groups.length);
			return true;
		} catch (e) {
			console.error("[bookmarks] Netscape import error:", e);
			return false;
		}
	}

	return {
		getColumns: () => columns,
		getGroups: () => groups,
		updateGroup,
		deleteGroup,
		moveGroup,
		moveBookmark,
		getTotalBookmarks,
		load: loadFromStorageAction,
		exportJson,
		importJson,
		importNetscapeHtml,
		getFaviconUrl,
	};
}

export const bookmarks = createBookmarksState();
