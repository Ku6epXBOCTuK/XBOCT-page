<script lang="ts">
	import type { Column as ColumnType, Group } from "@/types/bookmarks";
	import Column from "./Column.svelte";

	interface Props {
		columns: ColumnType[];
		groups: Group[];
	}

	let { columns, groups }: Props = $props();

	let sortedColumns = $derived(columns.toSorted((a, b) => a.order - b.order));
</script>

<div class="columns-grid">
	{#each sortedColumns as column (column.id)}
		<Column {column} {groups} />
	{/each}
</div>

<style>
	.columns-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}
</style>
