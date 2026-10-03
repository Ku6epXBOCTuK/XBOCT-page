<script lang="ts">
	import type {
		Column as ColumnType,
		Group,
	} from "$lib/state/bookmarks.svelte";
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import { dnd } from "$lib/state/dnd.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import { createDroppable } from "@dnd-kit/svelte";
	import PlusIcon from "~icons/lucide/plus";
	import EditGroupDialog from "../dialogs/EditGroupDialog.svelte";
	import DropIndicator from "./DropIndicator.svelte";
	import Widget from "./Widget.svelte";

	interface Props {
		column: ColumnType;
	}

	let { column }: Props = $props();

	let creatingGroup = $state<Group | null>(null);

	function handleCreate() {
		creatingGroup = {
			id: crypto.randomUUID(),
			columnId: column.id,
			order: columnGroups.length,
			name: "Новая группа",
			bookmarks: [],
		};
	}

	function handleCreateSave(group: Group) {
		bookmarks.addGroup(group);
		creatingGroup = null;
	}

	const droppable = createDroppable({
		get id() {
			return column.id;
		},
		accept: "group",
	});

	let columnGroups = $derived(
		bookmarks
			.getGroups()
			.filter((g) => g.columnId === column.id)
			.toSorted((a, b) => a.order - b.order),
	);
</script>

<div
	class="column"
	class:drop-target={dnd.isIndicatorIn("group", column.id)}
	{@attach droppable.attach}
	role="list"
>
	{#each columnGroups as group, i (group.id)}
		{#if dnd.isIndicatorAt("group", column.id, i)}
			<DropIndicator height={dnd.dragHeight} />
		{/if}
		<Widget {group} index={i} columnId={column.id} />
	{/each}
	{#if dnd.isIndicatorAt("group", column.id, columnGroups.length)}
		<DropIndicator height={dnd.dragHeight} />
	{/if}
	<Button
		label="Добавить группу"
		icon={PlusIcon}
		variant="ghost"
		onclick={handleCreate}
	/>
</div>

{#if creatingGroup}
	<EditGroupDialog
		group={creatingGroup}
		onsave={handleCreateSave}
		oncancel={() => (creatingGroup = null)}
	/>
{/if}

<style>
	.column {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		padding: var(--space-2xs);
		padding-bottom: var(--column-scroll-spacer);
		min-height: var(--column-min-height);
		border-radius: var(--radius-lg);
		transition: background var(--transition-fast);
	}

	.column.drop-target {
		background: var(--overlay-white-10);
	}
</style>
