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

const DEFAULT_COLUMNS: Column[] = [
	{ id: nanoid(), order: 0 },
	{ id: nanoid(), order: 1 },
	{ id: nanoid(), order: 2 },
	{ id: nanoid(), order: 3 },
];

const defaultGroups: Group[] = [
	{
		id: nanoid(),
		columnId: DEFAULT_COLUMNS[0].id,
		order: 0,
		name: "Essential Tools",
		icon: "briefcase",
		bookmarks: [
			{ id: nanoid(), title: "Google Drive", url: "https://drive.google.com" },
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
		columnId: DEFAULT_COLUMNS[0].id,
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
		columnId: DEFAULT_COLUMNS[1].id,
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
		columnId: DEFAULT_COLUMNS[2].id,
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
		columnId: DEFAULT_COLUMNS[3].id,
		order: 0,
		name: "Entertainment",
		icon: "gamepad-2",
		bookmarks: [
			{ id: nanoid(), title: "YouTube", url: "https://youtube.com" },
			{ id: nanoid(), title: "Twitch", url: "https://twitch.tv" },
		],
	},
];

interface BookmarksStore {
	getColumns(): Column[];
	getGroups(): Group[];
	updateGroup(updatedGroup: Group): void;
	deleteGroup(id: string): void;
	getTotalBookmarks(): number;
}

function createBookmarksState(): BookmarksStore {
	let columns = $state<Column[]>(DEFAULT_COLUMNS);
	let groups = $state<Group[]>(defaultGroups);

	return {
		getColumns: () => columns,
		getGroups: () => groups,
		updateGroup: (updatedGroup: Group) => {
			columns = columns;
			groups = groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
		},
		deleteGroup: (id: string) => {
			columns = columns;
			groups = groups.filter((g) => g.id !== id);
		},
		getTotalBookmarks: () =>
			groups.reduce((acc, g) => acc + g.bookmarks.length, 0),
	};
}

export const bookmarks = createBookmarksState();
