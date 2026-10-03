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

export interface GroupJson {
	column: number;
	name: string;
	icon?: string;
	bookmarks: [string, string][];
}

export interface StorageJson {
	version: number;
	groups: GroupJson[];
}

export const STORAGE_KEY = "bookmarks";
export const COLUMNS_COUNT = 4;
