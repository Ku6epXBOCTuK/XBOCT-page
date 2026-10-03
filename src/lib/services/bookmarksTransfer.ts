import type { ParsedGroup } from "$lib/services/bookmarks";
import { getFaviconUrl } from "$lib/services/bookmarksStorage";
import type { Column, Group, StorageJson } from "$lib/state/bookmarks.types";
import { nanoid } from "nanoid";

export function downloadJson(data: StorageJson, compressed: boolean): void {
	const json = compressed
		? JSON.stringify(data)
		: JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "bookmarks.json";
	a.click();
	URL.revokeObjectURL(url);
}

export async function readJsonFile(file: File): Promise<StorageJson | null> {
	try {
		const data = JSON.parse(await file.text()) as StorageJson;
		if (!data.version || !data.groups) return null;
		return data;
	} catch (e) {
		console.error("[bookmarks] Import error:", e);
		return null;
	}
}

export function groupsFromNetscape(
	parsed: ParsedGroup[],
	columns: Column[],
): Group[] {
	const groupsPerColumn = Math.ceil(parsed.length / columns.length);
	return parsed.map((g, idx) => ({
		id: nanoid(),
		columnId: columns[Math.floor(idx / groupsPerColumn)]?.id || columns[0].id,
		order: 0,
		name: g.name,
		bookmarks: g.bookmarks.map((b) => ({
			id: nanoid(),
			url: b[0],
			title: b[1],
			favicon: getFaviconUrl(b[0]),
		})),
	}));
}
