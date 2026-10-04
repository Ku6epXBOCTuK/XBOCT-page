<script lang="ts">
	import { bookmarks } from "$lib/state/bookmarks.svelte";

	const RECENT_COUNT = 5;

	let recent = $derived(
		bookmarks
			.getGroups()
			.flatMap((g) => g.bookmarks)
			.slice(-RECENT_COUNT)
			.reverse(),
	);
</script>

{#if recent.length > 0}
	<div class="recent">
		<h3 class="recent-title">Недавние</h3>
		{#each recent as bookmark (bookmark.id)}
			<a
				class="recent-link"
				href={bookmark.url}
				target="_blank"
				rel="noopener noreferrer"
			>
				{#if bookmark.favicon}
					<img src={bookmark.favicon} alt="" class="recent-favicon" />
				{/if}
				<span class="recent-name">{bookmark.title}</span>
			</a>
		{/each}
	</div>
{/if}

<style>
	.recent {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.recent-title {
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--on-surface-dim);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		margin: 0 0 var(--space-2xs);
	}

	.recent-link {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-2xs) var(--space-xs);
		border-radius: var(--radius-sm);
		color: var(--on-surface-variant);
		font-size: var(--text-xs);
		text-decoration: none;
	}

	.recent-link:hover {
		background: var(--overlay-white-5);
		color: var(--on-surface);
	}

	.recent-favicon {
		width: var(--size-favicon-sm);
		height: var(--size-favicon-sm);
		object-fit: contain;
		flex-shrink: 0;
	}

	.recent-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
