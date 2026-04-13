<script lang="ts">
	import type { Bookmark } from "$lib/state/bookmarks.svelte";
	import { createDroppable } from "@dnd-kit/svelte";
	import BookmarkLink from "./BookmarkLink.svelte";

	interface Props {
		bookmarks: Bookmark[];
		groupId: string;
	}

	let { bookmarks, groupId }: Props = $props();

	const droppable = $derived(createDroppable({ id: groupId }));
</script>

<div class="bookmark-list" {@attach droppable.attach}>
	{#each bookmarks as bookmark (bookmark.id)}
		<BookmarkLink {bookmark} {groupId} />
	{/each}
</div>

<style>
	.bookmark-list {
		display: flex;
		flex-direction: column;
	}
</style>
