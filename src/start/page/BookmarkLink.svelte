<script lang="ts">
	import type { Bookmark } from "@/state/bookmarks.svelte";

	interface Props {
		bookmark: Bookmark;
	}

	let { bookmark }: Props = $props();

	function openBookmark() {
		window.open(bookmark.url, "_blank");
	}
</script>

<button class="bookmark-link" onclick={openBookmark}>
	<span class="bookmark-title">{bookmark.title}</span>
</button>

<style>
	.bookmark-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.375rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		color: var(--on-surface-variant);
		font-size: 0.75rem;
		text-align: left;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.bookmark-link:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--on-surface);
	}

	.bookmark-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
