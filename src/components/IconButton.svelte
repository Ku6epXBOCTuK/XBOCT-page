<script lang="ts">
	import type { Component } from "svelte";

	interface Props {
		icon: Component;
		title?: string;
		onClick?: () => void;
		disabled?: boolean;
		variant?: "default" | "danger";
	}

	let {
		icon: Icon,
		title,
		onClick,
		disabled = false,
		variant = "default",
	}: Props = $props();
</script>

<button class="icon-btn {variant}" onclick={onClick} {disabled} {title}>
	<Icon />
</button>

<style>
	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		color: var(--on-surface-dim);
		cursor: pointer;
		transition:
			color 0.15s ease,
			background 0.15s ease;
	}

	.icon-btn:hover:not(:disabled) {
		background: var(--overlay-white-10);
		color: var(--on-surface);
	}

	.icon-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.icon-btn.danger:hover:not(:disabled) {
		color: var(--danger);
	}
</style>
