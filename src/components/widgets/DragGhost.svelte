<script lang="ts">
	import type { Bookmark, Group } from "$lib/state/bookmarks.svelte";

	interface Props {
		group: Pick<Group, "name"> & {
			bookmarks?: Pick<Bookmark, "id" | "title">[];
		};
	}

	let { group }: Props = $props();

	const PREVIEW_COUNT = 3;

	let previewBookmarks = $derived(
		group.bookmarks?.slice(0, PREVIEW_COUNT) ?? [],
	);
	let hiddenCount = $derived(
		Math.max((group.bookmarks?.length ?? 0) - PREVIEW_COUNT, 0),
	);
</script>

<div class="ghost-widget">
	<div class="ghost-header">
		<h2 class="widget-title">{group.name}</h2>
	</div>
	<div class="ghost-bookmarks">
		{#each previewBookmarks as bookmark (bookmark.id)}
			<div class="ghost-bookmark">
				<span class="ghost-bookmark-title">{bookmark.title}</span>
			</div>
		{/each}
		{#if hiddenCount > 0}
			<div class="ghost-more">
				+{hiddenCount} more
			</div>
		{/if}
	</div>
</div>

<style>
	.ghost-widget {
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		backdrop-filter: blur(var(--blur-md));
		background: var(--surface-container-alpha);
		border: 2px dashed var(--primary);
		border-radius: var(--radius-lg);
		opacity: 0.8;
		pointer-events: none;
		min-width: var(--ghost-min-width);
		max-width: var(--ghost-max-width);
	}

	.ghost-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: var(--space-2xs);
		margin-bottom: var(--space-sm);
		border-bottom: 1px solid var(--overlay-white-5);
	}

	.widget-title {
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		color: var(--primary);
		margin: 0;
	}

	.ghost-bookmarks {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.ghost-bookmark {
		padding: var(--space-2xs) var(--space-sm);
		background: var(--overlay-white-5);
		border-radius: var(--radius-sm);
	}

	.ghost-bookmark-title {
		font-size: var(--text-xs);
		color: var(--on-surface);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	.ghost-more {
		font-size: var(--text-2xs);
		color: var(--on-surface-variant);
		padding: var(--space-2xs) var(--space-sm);
		text-align: center;
	}
</style>
