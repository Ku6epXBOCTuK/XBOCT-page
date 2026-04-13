<script lang="ts">
	interface Props {
		title?: string;
		ghost?: boolean;
	}

	let { title = "Место вставки", ghost = false }: Props = $props();
</script>

<div class="insert-placeholder" class:ghost>
	{#if ghost && title}
		<span class="insert-title">{title}</span>
	{:else if !ghost}
		<span class="insert-title">{title}</span>
	{/if}
</div>

<style>
	.insert-placeholder {
		height: 40px;
		border: 2px dashed var(--primary);
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-alpha);
		pointer-events: none;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.insert-placeholder.ghost {
		border: 2px dashed var(--overlay-white-20);
		background: var(--overlay-white-5);
		animation: none;
		opacity: 0.5;
	}

	.insert-title {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--primary);
		font-weight: 600;
	}

	.insert-placeholder.ghost .insert-title {
		color: var(--on-surface-variant);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}
</style>
