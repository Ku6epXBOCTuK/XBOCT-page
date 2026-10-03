<script lang="ts">
	import type { Component } from "svelte";

	interface Props {
		label: string;
		icon?: Component;
		danger?: boolean;
		onclick?: () => void;
	}

	let { label, icon: Icon, danger = false, onclick }: Props = $props();
</script>

<button
	class="menu-item"
	class:danger
	role="menuitem"
	{onclick}
	onkeydown={(e) => e.key === "Enter" && onclick?.()}
>
	{#if Icon}
		<Icon />
	{/if}
	{label}
</button>

<style>
	.menu-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		background: transparent;
		border: none;
		color: var(--on-surface);
		font-size: var(--text-sm);
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-align: left;
	}

	.menu-item:hover {
		background: var(--overlay-white-10);
	}

	.menu-item.danger {
		color: var(--danger);
	}

	.menu-item :global(svg) {
		width: var(--size-icon-sm);
		height: var(--size-icon-sm);
	}
</style>
