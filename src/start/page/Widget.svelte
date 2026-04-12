<script lang="ts">
	import type { Component } from "svelte";
	import type { Group } from "@/state/bookmarks.svelte";
	import { bookmarks } from "@/state/bookmarks.svelte";
	import { createDraggable } from "@dnd-kit/svelte";
	import BrainIcon from "~icons/lucide/brain";
	import BriefcaseIcon from "~icons/lucide/briefcase";
	import CodeIcon from "~icons/lucide/code";
	import Gamepad2Icon from "~icons/lucide/gamepad-2";
	import UsersIcon from "~icons/lucide/users";
	import BookmarkList from "./BookmarkList.svelte";
	import EditGroupDialog from "./EditGroupDialog.svelte";
	import WidgetHeader from "./WidgetHeader.svelte";

	interface Props {
		group: Group;
	}

	let { group }: Props = $props();

	const draggable = createDraggable({ id: `group:${group.id}` });

	let editDialogOpen = $state(false);
	let menuOpen = $state(false);

	const iconMap: Record<string, Component> = {
		briefcase: BriefcaseIcon,
		brain: BrainIcon,
		code: CodeIcon,
		users: UsersIcon,
		"gamepad-2": Gamepad2Icon,
	};

	function handleSave(updatedGroup: Group) {
		bookmarks.updateGroup(updatedGroup);
		editDialogOpen = false;
	}

	function handleDelete() {
		bookmarks.deleteGroup(group.id);
		editDialogOpen = false;
	}
</script>

<div class="widget" {@attach draggable.attach}>
	<WidgetHeader
		name={group.name}
		icon={group.icon ? iconMap[group.icon] : undefined}
		onEdit={() => (editDialogOpen = true)}
		onMenu={() => (menuOpen = !menuOpen)}
	/>
	<BookmarkList bookmarks={group.bookmarks} groupId={group.id} />
</div>

{#if editDialogOpen}
	<EditGroupDialog
		{group}
		onSave={handleSave}
		onCancel={() => (editDialogOpen = false)}
		onDelete={handleDelete}
	/>
{/if}

{#if menuOpen}
	<div
		class="menu-overlay"
		onclick={() => (menuOpen = false)}
		onkeydown={(e) => e.key === "Escape" && (menuOpen = false)}
		role="presentation"
	>
		<div
			class="menu"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === "Escape" && (menuOpen = false)}
			role="menu"
			tabindex="-1"
		>
			<div class="menu-item" role="menuitem">П-placeholder меню</div>
		</div>
	</div>
{/if}

<style>
	.widget {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		backdrop-filter: blur(12px);
		background: var(--surface-container-alpha);
		border: 1px solid var(--overlay-white-5);
		border-radius: 0.5rem;
	}

	.menu-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
	}

	.menu {
		position: absolute;
		top: 2rem;
		right: 0.5rem;
		min-width: 120px;
		background: var(--surface);
		border: 1px solid var(--overlay-white-10);
		border-radius: 0.5rem;
		padding: 0.25rem;
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
