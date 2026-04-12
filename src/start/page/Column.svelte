<script lang="ts">
	import type { Column as ColumnType } from "@/state/bookmarks.svelte";
	import { bookmarks } from "@/state/bookmarks.svelte";
	import { createDroppable } from "@dnd-kit/svelte";
	import Widget from "./Widget.svelte";
	import InsertPlaceholder from "./InsertPlaceholder.svelte";

	interface Props {
		column: ColumnType;
		activeId?: string;
		activeOverId?: string;
	}

	let { column, activeId, activeOverId }: Props = $props();

	const droppable = createDroppable({ id: `column:${column.id}` });

	let columnGroups = $derived(
		bookmarks
			.getGroups()
			.filter((g) => g.columnId === column.id)
			.toSorted((a, b) => a.order - b.order),
	);

	let insertIndex = $state(-1);

	$effect(() => {
		const isDraggingGroup = activeId?.startsWith("group:");
		const isOverThisColumn = activeOverId === `column:${column.id}`;

		if (isDraggingGroup && isOverThisColumn) {
			insertIndex = columnGroups.length;
		} else {
			insertIndex = -1;
		}
	});
</script>

<div
	class="column"
	class:drop-target={droppable.isDropTarget}
	{@attach droppable.attach}
	role="list"
>
	{#each columnGroups as group, i (group.id)}
		{#if insertIndex === i}
			<div class="widget-wrapper">
				<InsertPlaceholder />
			</div>
		{/if}
		<div class="widget-wrapper">
			<Widget {group} isDragging={activeId === `group:${group.id}`} />
		</div>
	{/each}
	{#if insertIndex === columnGroups.length}
		<div class="widget-wrapper">
			<InsertPlaceholder />
		</div>
	{/if}
</div>

<style>
	.column {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.25rem;
		border-radius: 0.5rem;
		transition: background 0.15s ease;
	}

	.column.drop-target {
		background: var(--overlay-white-10);
	}

	.widget-wrapper {
		position: relative;
	}
</style>
