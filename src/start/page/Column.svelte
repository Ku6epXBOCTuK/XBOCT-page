<script lang="ts">
	import type { Column as ColumnType } from "@/state/bookmarks.svelte";
	import { bookmarks } from "@/state/bookmarks.svelte";
	import { createDroppable } from "@dnd-kit/svelte";
	import Widget from "./Widget.svelte";

	interface Props {
		column: ColumnType;
	}

	let { column }: Props = $props();

	const droppable = createDroppable({ id: `column:${column.id}` });

	let columnGroups = $derived(
		bookmarks
			.getGroups()
			.filter((g) => g.columnId === column.id)
			.toSorted((a, b) => a.order - b.order),
	);
</script>

<div
	class="column"
	class:drop-target={droppable.isDropTarget}
	{@attach droppable.attach}
>
	{#each columnGroups as group (group.id)}
		<Widget {group} />
	{/each}
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
</style>
