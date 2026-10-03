<script lang="ts">
	import type { Bookmark } from "$lib/state/bookmarks.svelte";
	import { dnd } from "$lib/state/dnd.svelte";
	import { createDroppable } from "@dnd-kit/svelte";
	import BookmarkLink from "./BookmarkLink.svelte";
	import DropIndicator from "./DropIndicator.svelte";

	interface Props {
		bookmarks: Bookmark[];
		groupId: string;
	}

	let { bookmarks, groupId }: Props = $props();

	const droppable = createDroppable({
		get id() {
			return groupId;
		},
		accept: "bookmark",
	});
</script>

<div class="bookmark-list" {@attach droppable.attach}>
	{#each bookmarks as bookmark, index (bookmark.id)}
		{#if dnd.isIndicatorAt("bookmark", groupId, index)}
			<DropIndicator height={dnd.dragHeight} />
		{/if}
		<BookmarkLink {bookmark} {groupId} {index} />
	{/each}
	{#if dnd.isIndicatorAt("bookmark", groupId, bookmarks.length)}
		<DropIndicator height={dnd.dragHeight} />
	{/if}
</div>

<style>
	.bookmark-list {
		display: flex;
		flex-direction: column;
		min-height: var(--drop-zone-min-height);
	}
</style>
