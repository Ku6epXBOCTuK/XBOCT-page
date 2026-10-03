<script lang="ts">
	import type { Bookmark } from "$lib/state/bookmarks.svelte";

	interface Props {
		bookmark: Pick<Bookmark, "title" | "favicon">;
	}

	let { bookmark }: Props = $props();
</script>

<div class="bookmark-ghost">
	{#if bookmark.favicon}
		<img src={bookmark.favicon} alt="" class="bookmark-favicon" />
	{/if}
	<span class="bookmark-title">{bookmark.title}</span>
</div>

<style>
	.bookmark-ghost {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-2xs) var(--space-xs);
		background: var(--surface-container-high-alpha);
		border-radius: var(--radius-sm);
		color: var(--on-surface);
		font-size: var(--text-xs);
		opacity: 0.9;
		pointer-events: none;
		max-width: var(--ghost-max-width);
	}

	.bookmark-favicon {
		width: var(--size-favicon-sm);
		height: var(--size-favicon-sm);
		object-fit: contain;
		flex-shrink: 0;
	}

	.bookmark-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
