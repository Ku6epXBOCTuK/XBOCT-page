<script lang="ts">
	import type { Group } from "$lib/state/bookmarks.svelte";
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import { createSortable } from "@dnd-kit/svelte/sortable";
	import { iconMap } from "$lib/icons";
	import BookmarkList from "./BookmarkList.svelte";
	import EditGroupDialog from "../dialogs/EditGroupDialog.svelte";
	import WidgetHeader from "./WidgetHeader.svelte";
	import WidgetMenu from "./WidgetMenu.svelte";

	interface Props {
		group: Group;
		index: number;
		columnId: string;
	}

	let { group, index, columnId }: Props = $props();

	const sortable = $derived(
		createSortable({
			id: group.id,
			index,
			group: columnId,
			data: {
				group: {
					id: group.id,
					name: group.name,
					icon: group.icon,
					bookmarks: group.bookmarks.map((b) => ({
						id: b.id,
						title: b.title,
						url: b.url,
						favicon: b.favicon,
					})),
				},
			},
		}),
	);

	let editDialogOpen = $state(false);
	let menuOpen = $state(false);

	let isDragging = $derived(sortable.isDragging);

	function handleSave(updatedGroup: Group) {
		bookmarks.updateGroup(updatedGroup);
		editDialogOpen = false;
	}

	function handleDelete() {
		bookmarks.deleteGroup(group.id);
		editDialogOpen = false;
	}
</script>

<div class="widget {isDragging ? 'dragging' : ''}" {@attach sortable.attach}>
	<WidgetHeader
		name={group.name}
		icon={group.icon ? iconMap[group.icon] : undefined}
		onedit={() => (editDialogOpen = true)}
		onmenu={() => (menuOpen = !menuOpen)}
	/>
	<BookmarkList bookmarks={group.bookmarks} groupId={group.id} />
</div>

{#if editDialogOpen}
	<EditGroupDialog
		{group}
		onsave={handleSave}
		oncancel={() => (editDialogOpen = false)}
		ondelete={handleDelete}
	/>
{/if}

<WidgetMenu open={menuOpen} onclose={() => (menuOpen = false)}>
	<div class="menu-item" role="menuitem">П-placeholder меню</div>
</WidgetMenu>

<style>
	.widget {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		backdrop-filter: blur(12px);
		background: var(--surface-container-alpha);
		border: 1px solid var(--overlay-white-5);
		border-radius: 0.5rem;
		transition: opacity 0.15s ease;
	}

	.widget.dragging {
		opacity: 0.3;
	}

	.menu-item {
		padding: 0.5rem 0.75rem;
		color: var(--on-surface);
		font-size: 0.875rem;
		border-radius: 0.25rem;
		cursor: pointer;
	}

	.menu-item:hover {
		background: var(--overlay-white-10);
	}
</style>
