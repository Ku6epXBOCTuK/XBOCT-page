<script lang="ts">
	import XIcon from "~icons/lucide/x";

	interface Props {
		title: string;
		onclose: () => void;
		children?: import("svelte").Snippet;
	}

	let { title, onclose, children }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") onclose();
	}
</script>

<div class="dialog-overlay" onclick={onclose} role="presentation">
	<div
		class="dialog"
		onclick={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onkeydown={handleKeydown}
	>
		<div class="dialog-header">
			<h2>{title}</h2>
			<button class="close-btn" onclick={onclose}>
				<XIcon />
			</button>
		</div>
		<div class="dialog-content">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	.dialog-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--overlay-black-70);
		z-index: 1000;
	}

	.dialog {
		width: 90%;
		max-width: 480px;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		background: var(--surface);
		border: 1px solid var(--overlay-white-10);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid var(--overlay-white-10);
	}

	.dialog-header h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		color: var(--on-surface-dim);
		cursor: pointer;
	}

	.close-btn:hover {
		background: var(--overlay-white-10);
		color: var(--on-surface);
	}

	.dialog-content {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
