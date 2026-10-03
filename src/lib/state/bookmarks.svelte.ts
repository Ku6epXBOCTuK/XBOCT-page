import { parseNetscapeHtml } from "$lib/services/bookmarks";
import { reorderBookmark, reorderGroup } from "$lib/services/bookmarksReorder";
import {
	ensureFavicon,
	ensureFourColumns,
	fromJson,
	getDefaultData,
	getFaviconUrl,
	groupsFromJson,
	loadFromStorage,
	saveToStorage,
	toJson,
} from "$lib/services/bookmarksStorage";
import {
	downloadJson,
	groupsFromNetscape,
	readJsonFile,
} from "$lib/services/bookmarksTransfer";
import type { Column, Group } from "./bookmarks.types";

export type { Bookmark, Column, Group } from "./bookmarks.types";

interface BookmarksState {
	getColumns(): Column[];
	getGroups(): Group[];
	addGroup(group: Group): void;
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

	async function persist() {
		await saveToStorage(toJson(groups, columns));
	}

	async function load(): Promise<void> {
		const data = await loadFromStorage();
		if (data?.groups) {
			const loaded = fromJson(data);
			columns = loaded.columns;
			groups = loaded.groups;
		} else {
			columns = ensureFourColumns(columns);
			groups = ensureFavicon(groups);
		}
	}

	function addGroup(group: Group) {
		groups = [...groups, group];
		persist();
	}

	function updateGroup(updatedGroup: Group) {
		groups = groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
		persist();
	}

	function deleteGroup(id: string) {
		groups = groups.filter((g) => g.id !== id);
		persist();
	}

	function moveGroup(
		groupId: string,
		targetColumnId: string,
		targetIndex: number,
	) {
		groups = reorderGroup(groups, groupId, targetColumnId, targetIndex);
		persist();
	}

	function moveBookmark(
		bookmarkId: string,
		fromGroupId: string,
		toGroupId: string,
		toIndex: number,
	) {
		groups = reorderBookmark(
			groups,
			bookmarkId,
			fromGroupId,
			toGroupId,
			toIndex,
		);
		persist();
	}

	function getTotalBookmarks(): number {
		return groups.reduce((acc, g) => acc + g.bookmarks.length, 0);
	}

	function exportJson(compressed = false) {
		downloadJson(toJson(groups, columns), compressed);
	}

	async function importJson(file: File): Promise<boolean> {
		const data = await readJsonFile(file);
		if (!data) return false;
		groups = groupsFromJson(data, columns);
		await persist();
		return true;
	}

	async function importNetscapeHtml(file: File): Promise<boolean> {
		try {
			const parsed = await parseNetscapeHtml(file);
			if (parsed.length === 0) return false;
			groups = groupsFromNetscape(parsed, columns);
			await persist();
			return true;
		} catch (e) {
			console.error("[bookmarks] Netscape import error:", e);
			return false;
		}
	}

	return {
		getColumns: () => columns,
		getGroups: () => groups,
		addGroup,
		updateGroup,
		deleteGroup,
		moveGroup,
		moveBookmark,
		getTotalBookmarks,
		load,
		exportJson,
		importJson,
		importNetscapeHtml,
		getFaviconUrl,
	};
}

export const bookmarks = createBookmarksState();
