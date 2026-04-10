<script lang="ts">
	import type { Component } from "svelte";
	import type { Group } from "@/types/bookmarks";
	import WidgetHeader from "./WidgetHeader.svelte";
	import BookmarkList from "./BookmarkList.svelte";
	import BriefcaseIcon from "~icons/lucide/briefcase";
	import BrainIcon from "~icons/lucide/brain";
	import CodeIcon from "~icons/lucide/code";
	import UsersIcon from "~icons/lucide/users";
	import Gamepad2Icon from "~icons/lucide/gamepad-2";

	interface Props {
		group: Group;
	}

	let { group }: Props = $props();

	const iconMap: Record<string, Component> = {
		briefcase: BriefcaseIcon,
		brain: BrainIcon,
		code: CodeIcon,
		users: UsersIcon,
		"gamepad-2": Gamepad2Icon,
	};
</script>

<div class="widget">
	<WidgetHeader
		name={group.name}
		icon={group.icon ? iconMap[group.icon] : undefined}
	/>
	<BookmarkList bookmarks={group.bookmarks} />
</div>

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
</style>
