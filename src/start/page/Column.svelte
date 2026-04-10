<script lang="ts">
	import type { Column, Group } from "@/types/bookmarks";
	import Widget from "./Widget.svelte";

	interface Props {
		column: Column;
		groups: Group[];
	}

	let { column, groups }: Props = $props();

	let columnGroups = $derived(
		groups
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
