<script lang="ts">
	import type { Bookmark } from "$lib/state/bookmarks.svelte";
	import { createSortable } from "@dnd-kit/svelte/sortable";
	import { SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
	import HandleIcon from "~icons/lucide/grip-vertical";

	interface Props {
		bookmark: Bookmark;
		groupId: string;
		index: number;
	}

	let { bookmark, groupId, index }: Props = $props();

	const sortable = createSortable({
		get id() {
			return bookmark.id;
		},
		get index() {
			return index;
		},
		get group() {
			return groupId;
		},
		type: "bookmark",
		accept: "bookmark",
		plugins: [SortableKeyboardPlugin],
	});
</script>

<a
	class="bookmark-link"
	href={bookmark.url}
	target="_blank"
	rel="noopener noreferrer"
	{@attach sortable.attach}
>
	{#if bookmark.favicon}
		<img src={bookmark.favicon} alt="" class="bookmark-favicon" />
	{/if}
	<span class="bookmark-title">{bookmark.title}</span>
	<HandleIcon {@attach sortable.attachHandle} class="bookmark-handle" />
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
