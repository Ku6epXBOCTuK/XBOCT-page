<script lang="ts">
	interface Props {
		height?: number;
	}

	let { height = 0 }: Props = $props();
</script>

<div
	class="drop-indicator"
	style:height={height > 0 ? `${height}px` : null}
></div>

<style>
	.drop-indicator {
		border: 2px dashed var(--primary);
		border-radius: var(--radius-lg);
		background: var(--primary-alpha);
		opacity: 0.5;
		min-height: var(--space-lg);
		pointer-events: none;
		flex-shrink: 0;
	}
</style>
