<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		variant?: "primary" | "secondary" | "danger" | "ghost";
		disabled?: boolean;
		onclick?: () => void;
		type?: "button" | "submit";
		children?: Snippet;
		class?: string;
	}

	let {
		variant = "primary",
		disabled = false,
		onclick,
		type = "button",
		children,
		class: className = "",
	}: Props = $props();
</script>

<button class="btn {variant} {className}" {type} {disabled} {onclick}>
	{@render children?.()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			opacity 0.15s ease,
			background 0.15s ease;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn.primary {
		background: var(--primary);
		color: var(--on-surface-inverse);
	}

	.btn.primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn.secondary {
		background: var(--overlay-white-10);
		color: var(--on-surface);
	}

	.btn.secondary:hover:not(:disabled) {
		background: var(--overlay-white-15);
	}

	.btn.danger {
		background: transparent;
		border: 1px solid var(--danger);
		color: var(--danger);
	}

	.btn.danger:hover:not(:disabled) {
		background: var(--danger-alpha);
	}

	.btn.ghost {
		background: transparent;
		border: 1px dashed var(--overlay-white-20);
		color: var(--on-surface-dim);
	}

	.btn.ghost:hover:not(:disabled) {
		border-color: var(--primary);
		color: var(--primary);
	}
</style>
