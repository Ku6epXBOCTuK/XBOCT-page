<script lang="ts">
	import { bookmarks } from "@/state/bookmarks.svelte";
	import Column from "./Column.svelte";

	let sortedColumns = $derived(
		[...bookmarks.getColumns()].toSorted((a, b) => a.order - b.order),
	);
</script>

<div class="columns-grid">
	{#each sortedColumns as column (column.id)}
		<Column {column} />
	{/each}
</div>

<style>
	.columns-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
	}
</style>
