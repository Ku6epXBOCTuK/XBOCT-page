<script lang="ts">
	import type { Bookmark } from "$lib/state/bookmarks.svelte";
	import { search } from "$lib/state/search.svelte";
	import { createSortable } from "@dnd-kit/svelte/sortable";
	import { SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
	import EyeIcon from "~icons/lucide/eye";
	import EyeOffIcon from "~icons/lucide/eye-off";
	import HandleIcon from "~icons/lucide/grip-vertical";

	interface Props {
		bookmark: Bookmark;
		groupId: string;
		index: number;
	}

	let { bookmark, groupId, index }: Props = $props();

	const REVEAL_TIMEOUT_MS = 10_000;

	let revealed = $state(false);
	let concealed = $derived(!!bookmark.hidden && !revealed);
	let revealTimer: ReturnType<typeof setTimeout> | undefined;

	function handleClick(e: MouseEvent) {
		if (concealed) e.preventDefault();
	}

	function toggleReveal(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		clearTimeout(revealTimer);
		revealed = !revealed;
		if (revealed) {
			revealTimer = setTimeout(() => {
				revealed = false;
			}, REVEAL_TIMEOUT_MS);
		}
	}

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
		feedback: "none",
		plugins: [SortableKeyboardPlugin],
		get data() {
			return {
				bookmark: {
					id: bookmark.id,
					title: bookmark.title,
					url: bookmark.url,
					favicon: bookmark.favicon,
				},
			};
		},
	});
</script>

<a
	class="bookmark-link"
	class:dimmed={search.active && !search.matchesBookmark(bookmark)}
	href={concealed ? undefined : bookmark.url}
	target="_blank"
	rel="noopener noreferrer"
	onclick={handleClick}
	{@attach sortable.attach}
>
	{#if bookmark.favicon}
		<img
			src={bookmark.favicon}
			alt=""
			class="bookmark-favicon"
			class:blurred={concealed}
		/>
	{/if}
	<span class="bookmark-title" class:blurred={concealed}>{bookmark.title}</span>
	{#if bookmark.hidden}
		<span
			class="bookmark-eye"
			role="button"
			tabindex="0"
			title={revealed ? "Скрыть" : "Показать"}
			onclick={toggleReveal}
			onkeydown={(e) => (e.key === "Enter" || e.key === " ") && toggleReveal(e)}
		>
			{#if revealed}
				<EyeOffIcon />
			{:else}
				<EyeIcon />
			{/if}
		</span>
	{/if}
	<span class="bookmark-handle" {@attach sortable.attachHandle}>
		<HandleIcon />
	</span>
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

	.bookmark-link.dimmed {
		opacity: 0.25;
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

	.bookmark-handle,
	.bookmark-eye {
		opacity: 0;
		transition: opacity var(--transition-slow);
	}

	.bookmark-handle {
		display: flex;
		align-items: center;
		cursor: grab;
		color: var(--on-surface-variant);
		flex-shrink: 0;
	}

	.bookmark-link:hover .bookmark-handle,
	.bookmark-link:hover .bookmark-eye {
		opacity: 1;
	}

	.bookmark-eye {
		cursor: pointer;
		color: var(--on-surface-variant);
		flex-shrink: 0;
	}

	.blurred {
		filter: blur(var(--blur-content));
		user-select: none;
	}
</style>
