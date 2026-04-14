<script lang="ts">
	import type { Component } from "svelte";

	interface Props {
		icon: Component;
		label?: string;
		size?: "default" | "mini";
		variant?: "primary" | "secondary" | "danger" | "ghost";
		disabled?: boolean;
		onclick?: () => void;
		type?: "button" | "submit";
		title?: string;
	}

	let {
		icon: Icon,
		label,
		size = "default",
		variant = "primary",
		disabled = false,
		onclick,
		type = "button",
		title,
	}: Props = $props();
</script>

<button class="btn {size} {variant}" {type} {disabled} {onclick} {title}>
	<Icon />
	{#if label}
		<span class="label">{label}</span>
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border: 1px solid transparent;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			opacity 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.btn.default {
		padding: 0.5rem 1rem;
	}

	.btn.mini {
		padding: 0.25rem;
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
		border-color: var(--overlay-white-10);
		color: var(--on-surface);
	}

	.btn.secondary:hover:not(:disabled) {
		background: var(--overlay-white-15);
	}

	.btn.danger {
		background: transparent;
		border-color: var(--danger);
		color: var(--danger);
	}

	.btn.danger:hover:not(:disabled) {
		background: var(--danger-alpha);
	}

	.btn.ghost {
		background: transparent;
		border-color: var(--overlay-white-20);
		color: var(--on-surface-dim);
	}

	.btn.ghost:hover:not(:disabled) {
		border-color: var(--primary);
		color: var(--primary);
	}
</style>
