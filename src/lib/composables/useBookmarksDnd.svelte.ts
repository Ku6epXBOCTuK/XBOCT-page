import type { Bookmark, Group } from "$lib/state/bookmarks.svelte";
import { bookmarks } from "$lib/state/bookmarks.svelte";

export interface DragData {
	group?: Pick<Group, "id" | "name" | "icon"> & {
		bookmarks: Pick<Bookmark, "id" | "title" | "url" | "favicon">[];
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DndEvent = any;

export function useBookmarksDnd() {
	let activeId = $state<string | undefined>(undefined);
	let activeOverId = $state<string | undefined>(undefined);
	let activeData = $state<DragData | null>(null);

	function ondragstart(event: DndEvent) {
		activeId = event.operation.source?.id as string;
		activeData = event.operation.source?.data as DragData;
		activeOverId = undefined;
	}

	function ondragover(event: DndEvent) {
		activeOverId = event.operation.target?.id as string;
	}

	function ondragend(event: DndEvent) {
		const active = event.operation?.source;
		const over = event.operation?.target;

		activeId = undefined;
		activeOverId = undefined;

		if (!over || !active) return;

		const activeIdStr = active.id as string;
		const overIdStr = over.id as string;
		const groups = bookmarks.getGroups();

		const isGroupActive = groups.some((g) => g.id === activeIdStr);
		const isGroupOver = groups.some((g) => g.id === overIdStr);

		if (isGroupActive) {
			moveGroupToTarget(activeIdStr, overIdStr, isGroupOver);
		} else if (activeIdStr.startsWith("bookmark:") && isGroupOver) {
			const [, bookmarkId, fromGroupId] = activeIdStr.split(":");
			const toGroup = groups.find((g) => g.id === overIdStr);
			if (!toGroup) return;
			bookmarks.moveBookmark(
				bookmarkId,
				fromGroupId,
				overIdStr,
				toGroup.bookmarks.length,
			);
		}
	}

	function moveGroupToTarget(
		groupId: string,
		overId: string,
		isGroupOver: boolean,
	) {
		const groups = bookmarks.getGroups();
		const columns = bookmarks.getColumns();

		if (isGroupOver) {
			const target = groups.find((g) => g.id === overId);
			if (!target) return;

			const columnGroups = groups
				.filter((g) => g.columnId === target.columnId)
				.toSorted((a, b) => a.order - b.order);
			const targetIndex = columnGroups.findIndex((g) => g.id === overId);
			bookmarks.moveGroup(groupId, target.columnId, targetIndex);
		} else {
			const targetColumn = columns.find((c) => c.id === overId);
			if (!targetColumn) return;
			const columnGroups = groups.filter((g) => g.columnId === targetColumn.id);
			bookmarks.moveGroup(groupId, targetColumn.id, columnGroups.length);
		}
	}

	return {
		get activeId() {
			return activeId;
		},
		get activeOverId() {
			return activeOverId;
		},
		get activeData() {
			return activeData;
		},
		ondragstart,
		ondragover,
		ondragend,
	};
}
