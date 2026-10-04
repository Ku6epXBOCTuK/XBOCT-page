<script lang="ts">
	import type { Group } from "$lib/state/bookmarks.svelte";
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import MenuItem from "$cmp/ui/MenuItem.svelte";
	import { createSortable } from "@dnd-kit/svelte/sortable";
	import { SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
	import { iconMap } from "$lib/icons";
	import PencilIcon from "~icons/lucide/pencil";
	import TrashIcon from "~icons/lucide/trash-2";
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

	const sortable = createSortable({
		get id() {
			return group.id;
		},
		get index() {
			return index;
		},
		get group() {
			return columnId;
		},
		type: "group",
		accept: "group",
		feedback: "none",
		plugins: [SortableKeyboardPlugin],
		get data() {
			return {
				group: {
					id: group.id,
					name: group.name,
					icon: group.icon,
					bookmarks: group.bookmarks.map((b) => ({
						id: b.id,
						title: b.title,
						url: b.url,
						favicon: b.favicon,
						hidden: b.hidden,
					})),
				},
			};
		},
	});

	let editDialogOpen = $state(false);
	let menuOpen = $state(false);
	let menuButton = $state<HTMLElement>();

	function handleSave(updatedGroup: Group) {
		bookmarks.updateGroup(updatedGroup);
		editDialogOpen = false;
	}

	function handleDelete() {
		bookmarks.deleteGroup(group.id);
		editDialogOpen = false;
	}

	function handleMenuDelete() {
		menuOpen = false;
		if (confirm(`Удалить группу «${group.name}» со всеми закладками?`)) {
			bookmarks.deleteGroup(group.id);
		}
	}
</script>

<div class="widget" {@attach sortable.attach}>
	<WidgetHeader
		name={group.name}
		icon={group.icon ? iconMap[group.icon] : undefined}
		dragHandle={sortable.attachHandle}
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
	<MenuItem
		label="Редактировать"
		icon={PencilIcon}
		onclick={() => {
			menuOpen = false;
			editDialogOpen = true;
		}}
	/>
	<MenuItem
		label="Удалить группу"
		icon={TrashIcon}
		danger
		onclick={handleMenuDelete}
	/>
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
</style>
