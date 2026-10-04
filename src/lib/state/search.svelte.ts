import type { Bookmark, Group } from "./bookmarks.types";

function createSearchState() {
	let query = $state("");

	const normalized = $derived(query.trim().toLowerCase());

	function matchesBookmark(bookmark: Bookmark): boolean {
		if (!normalized) return true;
		return (
			bookmark.title.toLowerCase().includes(normalized) ||
			bookmark.url.toLowerCase().includes(normalized)
		);
	}

	function matchesGroup(group: Group): boolean {
		if (!normalized) return true;
		return (
			group.name.toLowerCase().includes(normalized) ||
			group.bookmarks.some(matchesBookmark)
		);
	}

	return {
		get query() {
			return query;
		},
		set query(value: string) {
			query = value;
		},
		get active() {
			return normalized.length > 0;
		},
		matchesBookmark,
		matchesGroup,
	};
}

export const search = createSearchState();
