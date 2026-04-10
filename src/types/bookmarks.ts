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
	columnId: string;
	order: number;
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
	version: number;
}

export const DEFAULT_COLUMNS: Column[] = [
	{ id: nanoid(), order: 0 },
	{ id: nanoid(), order: 1 },
	{ id: nanoid(), order: 2 },
];
