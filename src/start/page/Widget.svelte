<script lang="ts">
	import type { Group } from "@/types/bookmarks";
	import WidgetHeader from "./WidgetHeader.svelte";
	import BookmarkList from "./BookmarkList.svelte";

	interface Props {
		group: Group;
	}

	let { group }: Props = $props();
</script>

<div class="widget">
	<WidgetHeader name={group.name} />
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
