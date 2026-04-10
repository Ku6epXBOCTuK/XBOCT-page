<script lang="ts">
	import type { Column, Group } from "@/types/bookmarks";
	import Widget from "./Widget.svelte";

	interface Props {
		column: Column;
		groups: Group[];
		onUpdateGroup: (group: Group) => void;
		onDeleteGroup: (id: string) => void;
	}

	let { column, groups, onUpdateGroup, onDeleteGroup }: Props = $props();

	let columnGroups = $derived(
		groups
			.filter((g) => g.columnId === column.id)
			.toSorted((a, b) => a.order - b.order),
	);
</script>

<div class="column">
	{#each columnGroups as group (group.id)}
		<Widget {group} {onUpdateGroup} {onDeleteGroup} />
	{/each}
</div>

<style>
	.column {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
