<script lang="ts">
	import type { Column as ColumnType } from "@/state/bookmarks";
	import { bookmarks } from "@/state/bookmarks";
	import Widget from "./Widget.svelte";

	interface Props {
		column: ColumnType;
	}

	let { column }: Props = $props();

	let columnGroups = $derived(
		bookmarks
			.getGroups()
			.filter((g) => g.columnId === column.id)
			.toSorted((a, b) => a.order - b.order),
	);
</script>

<div class="column">
	{#each columnGroups as group (group.id)}
		<Widget {group} />
	{/each}
</div>

<style>
	.column {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
