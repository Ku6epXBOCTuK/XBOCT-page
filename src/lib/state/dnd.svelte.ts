import type { Bookmark, Group } from "$lib/state/bookmarks.svelte";
import { bookmarks } from "$lib/state/bookmarks.svelte";
import { isSortable } from "@dnd-kit/dom/sortable";

export interface DragData {
	group?: Pick<Group, "id" | "name" | "icon"> & {
		bookmarks: Pick<Bookmark, "id" | "title" | "url" | "favicon">[];
	};
}

type Layer = "group" | "bookmark";

interface DropIndicator {
	layer: Layer;
	containerId: string;
	index: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DndEvent = any;

function createDndState() {
	let activeData = $state<DragData | null>(null);
	let indicator = $state<DropIndicator | null>(null);
	let dragHeight = $state(0);

	function getLayer(type: unknown): Layer | null {
		if (type === "group" || type === "bookmark") return type;
		return null;
	}

	function computeIndicator(event: DndEvent): DropIndicator | null {
		const { source, target } = event.operation ?? {};
		if (!source || !target || !isSortable(source)) return null;

		const layer = getLayer(source.sortable.type);
		if (!layer) return null;

		if (isSortable(target)) {
			const t = target.sortable;
			if (t.type !== source.sortable.type) return null;
			const position =
				event.operation.shape?.current?.center ??
				event.operation.position?.current;
			const targetShape = target.sortable.droppable.shape;
			const isBelow = targetShape ? position.y > targetShape.center.y : false;
			return {
				layer,
				containerId: String(t.group),
				index: t.index + (isBelow ? 1 : 0),
			};
		}

		const targetId = String(target.id);
		if (layer === "group") {
			if (!bookmarks.getColumns().some((c) => c.id === targetId)) return null;
			const count = bookmarks
				.getGroups()
				.filter((g) => g.columnId === targetId).length;
			return { layer, containerId: targetId, index: count };
		}

		const group = bookmarks.getGroups().find((g) => g.id === targetId);
		if (!group) return null;
		return { layer, containerId: targetId, index: group.bookmarks.length };
	}

	function ondragstart(event: DndEvent) {
		const source = event.operation.source;
		activeData = (source?.data as DragData) ?? null;
		dragHeight = source?.element?.getBoundingClientRect().height ?? 0;
	}

	function ondragover(event: DndEvent) {
		indicator = computeIndicator(event);
	}

	function ondragend(event: DndEvent) {
		const drop = computeIndicator(event);
		const { source } = event.operation ?? {};

		indicator = null;
		activeData = null;
		dragHeight = 0;

		if (!source || !drop || event.canceled || !isSortable(source)) return;

		const s = source.sortable;
		const sourceId = String(s.id);
		const fromContainerId = String(s.initialGroup);
		const fromIndex = s.initialIndex;
		let toIndex = drop.index;

		if (fromContainerId === drop.containerId) {
			if (fromIndex < toIndex) toIndex -= 1;
			if (fromIndex === toIndex) return;
		}

		if (drop.layer === "group") {
			bookmarks.moveGroup(sourceId, drop.containerId, toIndex);
		} else {
			bookmarks.moveBookmark(
				sourceId,
				fromContainerId,
				drop.containerId,
				toIndex,
			);
		}
	}

	function isIndicatorAt(
		layer: Layer,
		containerId: string,
		index: number,
	): boolean {
		return (
			indicator?.layer === layer &&
			indicator.containerId === containerId &&
			indicator.index === index
		);
	}

	return {
		get activeData() {
			return activeData;
		},
		get dragHeight() {
			return dragHeight;
		},
		ondragstart,
		ondragover,
		ondragend,
		isIndicatorAt,
	};
}

export const dnd = createDndState();
