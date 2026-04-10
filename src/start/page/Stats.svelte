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
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.stats h1 {
		font-size: 1.125rem;
		font-weight: 700;
	}

	.stats-count {
		font-size: 0.75rem;
		color: var(--on-surface-variant);
		opacity: 0.6;
	}
</style>
