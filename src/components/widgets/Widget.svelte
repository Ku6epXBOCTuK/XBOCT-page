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
	let menuButton = $state<HTMLElement>();

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
		bind:menuButtonRef={menuButton}
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

<WidgetMenu
	open={menuOpen}
	buttonRef={menuButton}
	onclose={() => (menuOpen = false)}
>
	<div class="menu-item" role="menuitem">П-placeholder меню</div>
</WidgetMenu>

<style>
	.widget {
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		backdrop-filter: blur(var(--blur-md));
		background: var(--surface-container-alpha);
		border: 1px solid var(--overlay-white-5);
		border-radius: var(--radius-lg);
		transition: opacity var(--transition-fast);
	}

	.widget.dragging {
		opacity: 0.3;
	}

	.menu-item {
		padding: var(--space-sm) var(--space-md);
		color: var(--on-surface);
		font-size: var(--text-sm);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}

	.menu-item:hover {
		background: var(--overlay-white-10);
	}
</style>
