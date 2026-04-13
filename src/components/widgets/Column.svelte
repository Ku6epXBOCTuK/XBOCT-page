<script lang="ts">
	import type { Column as ColumnType } from "$lib/state/bookmarks.svelte";
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import { createDroppable } from "@dnd-kit/svelte";
	import Widget from "./Widget.svelte";

	interface Props {
		column: ColumnType;
		activeId?: string;
		activeOverId?: string;
	}

	let { column, activeId, activeOverId }: Props = $props();

	const droppable = $derived(
		createDroppable({
			id: column.id,
			accept: ["item", column.id],
		}),
	);

	let columnGroups = $derived(
		bookmarks
			.getGroups()
			.filter((g) => g.columnId === column.id)
			.toSorted((a, b) => a.order - b.order),
	);

	let columnGroupIds = $derived(columnGroups.map((g) => g.id));

	let insertIndex = $derived.by(() => {
		if (!activeOverId || activeOverId === activeId) return -1;
		if (activeOverId === column.id) {
			return columnGroups.length;
		}
		const idx = columnGroupIds.indexOf(activeOverId);
		return idx >= 0 ? idx + 1 : -1;
	});

	let shouldHighlight = $derived(insertIndex >= 0);
</script>

<div
	class="column {shouldHighlight ? 'drop-target' : ''}"
	{@attach droppable.attach}
	role="list"
>
	{#each columnGroups as group, i (group.id)}
		<Widget {group} index={i} columnId={column.id} />
	{/each}
</div>

<style>
	.column {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.25rem;
		padding-bottom: 200px;
		min-height: 200px;
		border-radius: 0.5rem;
		transition: background 0.15s ease;
	}

	.column.drop-target {
		background: var(--overlay-white-10);
	}
</style>
