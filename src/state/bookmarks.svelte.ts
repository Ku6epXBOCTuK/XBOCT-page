import { nanoid } from "nanoid";

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

interface StorageData {
	version: number;
	columns: Column[] | Record<string, Column>;
	groups: Group[] | Record<string, Group>;
}

const STORAGE_KEY = "bookmarks";
const COLUMNS_COUNT = 4;

function getExtensionId(): string | null {
	if (typeof chrome !== "undefined" && chrome.runtime?.id) {
		return chrome.runtime.id;
	}
	return null;
}

function getFaviconUrl(url: string): string {
	const extId = getExtensionId();
	if (!extId) return "";
	return `chrome-extension://${extId}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`;
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
					favicon: "",
				},
			],
		},
	];
}

function getDefaultData(): { columns: Column[]; groups: Group[] } {
	const defaultColumns = generateDefaultColumns();
	return {
		columns: defaultColumns,
		groups: generateDefaultGroups(defaultColumns),
	};
}

function parseStorageData(data: StorageData): {
	columns: Column[];
	groups: Group[];
} {
	const columns: Column[] = Array.isArray(data.columns)
		? data.columns
		: (Object.values(data.columns) as Column[]);

	const processGroup = (g: Group): Group => ({
		...g,
		bookmarks: Array.isArray(g.bookmarks)
			? g.bookmarks
			: (Object.values(g.bookmarks || {}) as Bookmark[]),
	});

	const groups: Group[] = Array.isArray(data.groups)
		? data.groups.map(processGroup)
		: Object.values(data.groups).map(processGroup);

	return { columns, groups };
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

interface BookmarksStore {
	getColumns(): Column[];
	getGroups(): Group[];
	updateGroup(updatedGroup: Group): void;
	deleteGroup(id: string): void;
	getTotalBookmarks(): number;
	load(): Promise<void>;
	exportJson(compressed?: boolean): void;
	importJson(file: File): Promise<boolean>;
	getFaviconUrl(url: string): string;
}

function createBookmarksState(): BookmarksStore {
	const defaultData = getDefaultData();
	let columns = $state<Column[]>(defaultData.columns);
	let groups = $state<Group[]>(defaultData.groups);

	async function saveToStorage() {
		try {
			console.log("[bookmarks] Saved columns:", $state.snapshot(columns));
			console.log("[bookmarks] Saved groups:", $state.snapshot(groups));
			await chrome.storage.sync.set({
				[STORAGE_KEY]: { version: 1, columns, groups },
			});
		} catch {
			// Ignore storage errors (e.g., in incognito)
		}
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

	async function loadFromStorageAction(): Promise<void> {
		try {
			const result = await chrome.storage.sync.get(STORAGE_KEY);
			const data = result[STORAGE_KEY] as StorageData | undefined;
			console.log("[bookmarks] Storage data:", data);
			if (data && data.columns && data.groups) {
				const loaded = parseStorageData(data);
				columns = ensureFourColumns(loaded.columns);
				groups = ensureFavicon(loaded.groups);
				console.log("[bookmarks] Loaded columns:", $state.snapshot(columns));
				console.log("[bookmarks] Loaded groups:", $state.snapshot(groups));
			} else {
				columns = ensureFourColumns(columns);
			}
		} catch (e) {
			console.error("[bookmarks] Storage error:", e);
		}
	}

	function doUpdateGroup(updatedGroup: Group) {
		columns = columns;
		groups = groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
		saveToStorage();
	}

	function doDeleteGroup(id: string) {
		columns = columns;
		groups = groups.filter((g) => g.id !== id);
		saveToStorage();
	}

	function doGetTotalBookmarks(): number {
		if (!Array.isArray(groups)) return 0;
		return groups.reduce((acc, g) => acc + g.bookmarks.length, 0);
	}

	function doExportJson(compressed = false) {
		const data = {
			version: 1,
			groups: $state.snapshot(groups).map((g) => ({
				column: columns.findIndex((c) => c.id === g.columnId),
				name: g.name,
				icon: g.icon,
				bookmarks: g.bookmarks.map((b) => [b.url, b.title]),
			})),
		};
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

	async function doImportJson(file: File): Promise<boolean> {
		try {
			const text = await file.text();
			const data = JSON.parse(text);
			console.log("[bookmarks] Importing:", text.slice(0, 500) + "...");
			if (!data.version || !data.groups) {
				console.log("[bookmarks] Import failed: invalid format");
				return false;
			}

			const importedGroups = data.groups as Array<{
				column: number;
				name: string;
				icon?: string;
				bookmarks: Array<[string, string]>;
			}>;

			const existingColumns = columns;
			const numColumns = COLUMNS_COUNT;

			groups = importedGroups.map((g) => {
				const columnIndex = g.column % numColumns;
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

	return {
		getColumns: () => columns,
		getGroups: () => groups,
		updateGroup: doUpdateGroup,
		deleteGroup: doDeleteGroup,
		getTotalBookmarks: doGetTotalBookmarks,
		load: loadFromStorageAction,
		exportJson: doExportJson,
		importJson: doImportJson,
		getFaviconUrl,
	};
}

export const bookmarks = createBookmarksState();
