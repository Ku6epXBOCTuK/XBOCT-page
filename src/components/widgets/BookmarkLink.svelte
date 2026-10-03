<script lang="ts">
	import type { Bookmark } from "$lib/state/bookmarks.svelte";
	import { createDraggable } from "@dnd-kit/svelte";
	import HandleIcon from "~icons/lucide/grip-vertical";

	interface Props {
		bookmark: Bookmark;
		groupId: string;
	}

	let { bookmark, groupId }: Props = $props();

	const draggable = $derived(
		createDraggable({
			id: `bookmark:${bookmark.id}:${groupId}`,
		}),
	);
</script>

<a
	class="bookmark-link"
	href={bookmark.url}
	target="_blank"
	rel="noopener noreferrer"
	{@attach draggable.attach}
>
	{#if bookmark.favicon}
		<img src={bookmark.favicon} alt="" class="bookmark-favicon" />
	{/if}
	<span class="bookmark-title">{bookmark.title}</span>
	<HandleIcon {@attach draggable.attachHandle} class="bookmark-handle" />
</a>

<style>
	.bookmark-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		padding: var(--space-2xs) var(--space-xs);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--on-surface-variant);
		font-size: var(--text-xs);
		text-align: left;
		cursor: pointer;
		text-decoration: none;
		transition:
			background var(--transition-normal),
			color var(--transition-normal);
		position: relative;
	}

	.bookmark-link:hover {
		background: var(--overlay-white-5);
		color: var(--on-surface);
	}

	.bookmark-favicon {
		width: var(--size-favicon-sm);
		height: var(--size-favicon-sm);
		object-fit: contain;
		flex-shrink: 0;
	}

	.bookmark-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex-grow: 1;
	}

	.bookmark-link :global(.bookmark-handle) {
		cursor: grab;
		opacity: 0;
		transition: opacity var(--transition-slow);
	}

	.bookmark-link:hover :global(.bookmark-handle) {
		cursor: grab;
		opacity: 1;
	}
</style>
