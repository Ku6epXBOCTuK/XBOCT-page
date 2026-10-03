import type { Group } from "$lib/state/bookmarks.types";

export function reorderGroup(
	groups: Group[],
	groupId: string,
	targetColumnId: string,
	targetIndex: number,
): Group[] {
	const group = groups.find((g) => g.id === groupId);
	if (!group) return groups;

	const sourceColumnId = group.columnId;

	if (sourceColumnId === targetColumnId) {
		const columnGroups = groups
			.filter((g) => g.columnId === sourceColumnId)
			.toSorted((a, b) => a.order - b.order);
		const sourceIndex = columnGroups.findIndex((g) => g.id === groupId);
		const moved = columnGroups.splice(sourceIndex, 1)[0];
		columnGroups.splice(targetIndex, 0, moved);
		return groups.map((g) => {
			const idx = columnGroups.findIndex((cg) => cg.id === g.id);
			return idx >= 0 ? { ...g, order: idx } : g;
		});
	}

	const sourceColumnGroups = groups
		.filter((g) => g.columnId === sourceColumnId)
		.toSorted((a, b) => a.order - b.order);
	const sourceIndex = sourceColumnGroups.findIndex((g) => g.id === groupId);
	const moved = sourceColumnGroups.splice(sourceIndex, 1)[0];

	const targetColumnGroups = groups
		.filter((g) => g.columnId === targetColumnId)
		.toSorted((a, b) => a.order - b.order);
	targetColumnGroups.splice(targetIndex, 0, moved);

	return groups.map((g) => {
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

export function reorderBookmark(
	groups: Group[],
	bookmarkId: string,
	fromGroupId: string,
	toGroupId: string,
	toIndex: number,
): Group[] {
	const fromGroup = groups.find((g) => g.id === fromGroupId);
	const toGroup = groups.find((g) => g.id === toGroupId);
	if (!fromGroup || !toGroup) return groups;

	const bookmark = fromGroup.bookmarks.find((b) => b.id === bookmarkId);
	if (!bookmark) return groups;

	if (fromGroupId === toGroupId) {
		const list = fromGroup.bookmarks.filter((b) => b.id !== bookmarkId);
		list.splice(toIndex, 0, bookmark);
		return groups.map((g) =>
			g.id === fromGroupId ? { ...g, bookmarks: list } : g,
		);
	}

	return groups.map((g) => {
		if (g.id === fromGroupId) {
			return {
				...g,
				bookmarks: g.bookmarks.filter((b) => b.id !== bookmarkId),
			};
		}
		if (g.id === toGroupId) {
			const list = [...g.bookmarks];
			list.splice(toIndex, 0, bookmark);
			return { ...g, bookmarks: list };
		}
		return g;
	});
}
