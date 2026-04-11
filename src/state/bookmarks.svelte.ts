import { nanoid } from "nanoid";

export interface Bookmark {
	id: string;
	title: string;
	url: string;
	favicon?: string;
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
	columns: Column[];
	groups: Group[];
}

const STORAGE_KEY = "bookmarks";

function generateDefaultData(): StorageData {
	const defaultColumns: Column[] = [
		{ id: nanoid(), order: 0 },
		{ id: nanoid(), order: 1 },
		{ id: nanoid(), order: 2 },
		{ id: nanoid(), order: 3 },
	];

	const defaultGroups: Group[] = [
		{
			id: nanoid(),
			columnId: defaultColumns[0].id,
			order: 0,
			name: "Essential Tools",
			icon: "briefcase",
			bookmarks: [
				{
					id: nanoid(),
					title: "Google Drive",
					url: "https://drive.google.com",
				},
				{ id: nanoid(), title: "Gmail", url: "https://gmail.com" },
				{
					id: nanoid(),
					title: "Google Calendar",
					url: "https://calendar.google.com",
				},
			],
		},
		{
			id: nanoid(),
			columnId: defaultColumns[0].id,
			order: 1,
			name: "AI Lab",
			icon: "brain",
			bookmarks: [
				{ id: nanoid(), title: "ChatGPT", url: "https://chat.openai.com" },
				{ id: nanoid(), title: "Claude", url: "https://claude.ai" },
			],
		},
		{
			id: nanoid(),
			columnId: defaultColumns[1].id,
			order: 0,
			name: "Dev Hub",
			icon: "code",
			bookmarks: [
				{ id: nanoid(), title: "GitHub", url: "https://github.com" },
				{
					id: nanoid(),
					title: "Stack Overflow",
					url: "https://stackoverflow.com",
				},
				{ id: nanoid(), title: "MDN", url: "https://developer.mozilla.org" },
			],
		},
		{
			id: nanoid(),
			columnId: defaultColumns[2].id,
			order: 0,
			name: "Social",
			icon: "users",
			bookmarks: [
				{ id: nanoid(), title: "Twitter", url: "https://twitter.com" },
				{ id: nanoid(), title: "LinkedIn", url: "https://linkedin.com" },
			],
		},
		{
			id: nanoid(),
			columnId: defaultColumns[3].id,
			order: 0,
			name: "Entertainment",
			icon: "gamepad-2",
			bookmarks: [
				{ id: nanoid(), title: "YouTube", url: "https://youtube.com" },
				{ id: nanoid(), title: "Twitch", url: "https://twitch.tv" },
			],
		},
	];

	return { version: 1, columns: defaultColumns, groups: defaultGroups };
}

const defaultData = generateDefaultData();

interface BookmarksStore {
	getColumns(): Column[];
	getGroups(): Group[];
	updateGroup(updatedGroup: Group): void;
	deleteGroup(id: string): void;
	getTotalBookmarks(): number;
	load(): Promise<void>;
}

function createBookmarksState(): BookmarksStore {
	let columns = $state<Column[]>(defaultData.columns);
	let groups = $state<Group[]>(defaultData.groups);

	async function save() {
		try {
			console.log("Saved columns:", $state.snapshot(columns));
			console.log("Saved groups:", $state.snapshot(groups));
			await chrome.storage.sync.set({
				[STORAGE_KEY]: { version: 1, columns, groups },
			});
		} catch {
			// Ignore storage errors (e.g., in incognito)
		}
	}

	async function load() {
		try {
			const result = await chrome.storage.sync.get(STORAGE_KEY);
			const data = result[STORAGE_KEY] as StorageData | undefined;
			console.log("Storage data:", data);
			if (data && data.columns && data.groups) {
				columns = Object.values(data.columns) as Column[];
				groups = Object.values(data.groups).map((g) => ({
					...g,
					bookmarks: Object.values(g.bookmarks || {}) as Bookmark[],
				})) as Group[];
				console.log("Loaded columns:", $state.snapshot(columns));
				console.log("Loaded groups:", $state.snapshot(groups));
			}
		} catch (e) {
			console.error("Storage error:", e);
		}
	}

	return {
		getColumns: () => columns,
		getGroups: () => groups,
		updateGroup: (updatedGroup: Group) => {
			columns = columns;
			groups = groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
			save();
		},
		deleteGroup: (id: string) => {
			columns = columns;
			groups = groups.filter((g) => g.id !== id);
			save();
		},
		getTotalBookmarks: () => {
			if (!Array.isArray(groups)) return 0;
			return groups.reduce((acc, g) => acc + g.bookmarks.length, 0);
		},
		load,
	};
}

export const bookmarks = createBookmarksState();
