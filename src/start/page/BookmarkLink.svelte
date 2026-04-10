<script lang="ts">
	import type { Bookmark } from "@/state/bookmarks.svelte";

	interface Props {
		bookmark: Bookmark;
	}

	let { bookmark }: Props = $props();
</script>

<a
	class="bookmark-link"
	href={bookmark.url}
	target="_blank"
	rel="noopener noreferrer"
>
	<span class="bookmark-title">{bookmark.title}</span>
</a>

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
		text-decoration: none;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.bookmark-link:hover {
		background: var(--overlay-white-5);
		color: var(--on-surface);
	}

	.bookmark-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
