<script lang="ts">
	import type { Bookmark } from "@/state/bookmarks.svelte";
	import BookmarkLink from "./BookmarkLink.svelte";

	interface Props {
		bookmarks: Bookmark[];
	}

	let { bookmarks }: Props = $props();
</script>

<div class="bookmark-list">
	{#each bookmarks as bookmark (bookmark.id)}
		<BookmarkLink {bookmark} />
	{/each}
</div>

<style>
	.bookmark-list {
		display: flex;
		flex-direction: column;
	}
</style>
