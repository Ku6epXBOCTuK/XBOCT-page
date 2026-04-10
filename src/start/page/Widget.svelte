<script lang="ts">
	import type { Component } from "svelte";
	import type { Group } from "@/types/bookmarks";
	import WidgetHeader from "./WidgetHeader.svelte";
	import BookmarkList from "./BookmarkList.svelte";
	import EditGroupDialog from "./EditGroupDialog.svelte";
	import BriefcaseIcon from "~icons/lucide/briefcase";
	import BrainIcon from "~icons/lucide/brain";
	import CodeIcon from "~icons/lucide/code";
	import UsersIcon from "~icons/lucide/users";
	import Gamepad2Icon from "~icons/lucide/gamepad-2";

	interface Props {
		group: Group;
		onUpdateGroup: (group: Group) => void;
		onDeleteGroup: (id: string) => void;
	}

	let { group, onUpdateGroup, onDeleteGroup }: Props = $props();

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
		onUpdateGroup(updatedGroup);
		editDialogOpen = false;
	}

	function handleDelete() {
		onDeleteGroup(group.id);
		editDialogOpen = false;
	}
</script>

<div class="widget">
	<WidgetHeader
		name={group.name}
		icon={group.icon ? iconMap[group.icon] : undefined}
		onEdit={() => (editDialogOpen = true)}
		onMenu={() => (menuOpen = !menuOpen)}
	/>
	<BookmarkList bookmarks={group.bookmarks} />
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
		background: rgba(23, 26, 31, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.05);
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
		border: 1px solid rgba(255, 255, 255, 0.1);
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
		background: rgba(255, 255, 255, 0.1);
	}
</style>
