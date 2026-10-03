import type { Bookmark, Group } from "$lib/state/bookmarks.svelte";
import { bookmarks } from "$lib/state/bookmarks.svelte";
import type { Draggable, Droppable } from "@dnd-kit/dom";
import { isSortable, type SortableDraggable } from "@dnd-kit/dom/sortable";

export interface DragData {
	group?: Pick<Group, "id" | "name" | "icon"> & {
		bookmarks: Pick<Bookmark, "id" | "title" | "url" | "favicon">[];
	};
	bookmark?: Pick<Bookmark, "id" | "title" | "url" | "favicon">;
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
	let sourceInfo = $state<{
		layer: Layer;
		containerId: string;
		index: number;
	} | null>(null);
	let sourceElement: HTMLElement | null = null;

	function getLayer(type: unknown): Layer | null {
		if (type === "group" || type === "bookmark") return type;
		return null;
	}

	function containerAtPoint(
		source: SortableDraggable<DragData>,
		x: number,
		y: number,
	): string | null {
		const manager = source.sortable.manager;
		if (!manager) return null;

		for (const droppable of manager.registry.droppables) {
			if (isSortable(droppable)) continue;
			if (!droppable.accepts(source)) continue;
			const el = droppable.element;
			if (!el) continue;
			const rect = el.getBoundingClientRect();
			if (
				x >= rect.left &&
				x <= rect.right &&
				y >= rect.top &&
				y <= rect.bottom
			) {
				return String(droppable.id);
			}
		}
		return null;
	}

	function indexAtPosition(
		source: SortableDraggable<DragData>,
		layer: Layer,
		containerId: string,
		pointerY: number,
	): number {
		const manager = source.sortable.manager;
		if (!manager) return 0;

		let index = 0;
		for (const droppable of manager.registry.droppables) {
			if (!isSortable(droppable)) continue;
			const s = droppable.sortable;
			if (getLayer(s.type) !== layer) continue;
			if (String(s.group) !== containerId) continue;
			if (s.id === source.id) continue;
			const el = (droppable as Droppable).element;
			if (!el) continue;
			const rect = el.getBoundingClientRect();
			if (rect.height === 0) continue;
			if (pointerY > rect.top + rect.height / 2) index++;
		}
		return index;
	}

	function computeIndicator(event: DndEvent): DropIndicator | null {
		const { source: rawSource } = event.operation ?? {};
		if (!rawSource || !isSortable(rawSource)) return null;
		const source = rawSource as SortableDraggable<DragData>;

		const layer = getLayer(source.sortable.type);
		if (!layer) return null;

		const position = event.operation.position?.current;
		if (!position) return null;

		const containerId = containerAtPoint(source, position.x, position.y);
		if (!containerId) return null;

		const index = indexAtPosition(source, layer, containerId, position.y);
		return { layer, containerId, index };
	}

	function ondragstart(event: DndEvent) {
		const source = event.operation.source as Draggable | null;
		activeData = (source?.data as DragData) ?? null;
		dragHeight = source?.element?.getBoundingClientRect().height ?? 0;

		if (source && isSortable(source)) {
			const layer = getLayer(source.sortable.type);
			if (layer) {
				sourceInfo = {
					layer,
					containerId: String(source.sortable.initialGroup),
					index: source.sortable.initialIndex,
				};
			}
			sourceElement = (source.element as HTMLElement) ?? null;
			if (sourceElement) sourceElement.style.display = "none";
		}
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
		sourceInfo = null;
		if (sourceElement) {
			sourceElement.style.display = "";
			sourceElement = null;
		}

		if (!source || !drop || event.canceled || !isSortable(source)) return;

		const s = source.sortable;
		const sourceId = String(s.id);
		const fromContainerId = String(s.initialGroup);
		const fromIndex = s.initialIndex;

		if (fromContainerId === drop.containerId && fromIndex === drop.index) {
			return;
		}

		if (drop.layer === "group") {
			bookmarks.moveGroup(sourceId, drop.containerId, drop.index);
		} else {
			bookmarks.moveBookmark(
				sourceId,
				fromContainerId,
				drop.containerId,
				drop.index,
			);
		}
	}

	function isIndicatorAt(
		layer: Layer,
		containerId: string,
		slot: number,
	): boolean {
		if (indicator?.layer !== layer || indicator.containerId !== containerId) {
			return false;
		}
		let renderIndex = indicator.index;
		if (
			sourceInfo &&
			sourceInfo.layer === layer &&
			sourceInfo.containerId === containerId &&
			indicator.index >= sourceInfo.index
		) {
			renderIndex += 1;
		}
		return renderIndex === slot;
	}

	function isIndicatorIn(layer: Layer, containerId: string): boolean {
		return indicator?.layer === layer && indicator.containerId === containerId;
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
		isIndicatorIn,
	};
}

export const dnd = createDndState();
