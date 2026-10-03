<script lang="ts">
	interface Props {
		count: number;
	}

	let { count }: Props = $props();
</script>

<section class="stats">
	<h1>My Bookmarks</h1>
	<span class="stats-count">{count} bookmarks</span>
</section>

<style>
	.stats {
		display: flex;
		align-items: baseline;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.stats h1 {
		font-size: var(--text-lg);
		font-weight: 700;
	}

	.stats-count {
		font-size: var(--text-xs);
		color: var(--on-surface-variant);
		opacity: 0.6;
	}
</style>
