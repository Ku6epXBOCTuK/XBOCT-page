<script lang="ts">
	import type { Component } from "svelte";
	import PencilIcon from "~icons/lucide/pencil";
	import MoreVerticalIcon from "~icons/lucide/more-vertical";

	interface Props {
		name: string;
		icon?: Component;
		onEdit?: () => void;
		onMenu?: () => void;
	}

	let { name, icon: Icon, onEdit, onMenu }: Props = $props();
</script>

<div class="widget-header">
	<h2 class="widget-title">{name}</h2>
	<div class="widget-header-right">
		{#if Icon}
			<div class="widget-icon">
				<Icon />
			</div>
		{/if}
		<div class="widget-header-actions">
			<button class="header-btn" onclick={onEdit} title="Редактировать">
				<PencilIcon />
			</button>
			<button class="header-btn" onclick={onMenu} title="Меню">
				<MoreVerticalIcon />
			</button>
		</div>
	</div>
</div>

<style>
	.widget-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.25rem;
		margin-bottom: 0.5rem;
		border-bottom: 1px solid var(--overlay-white-5);
	}

	.widget-header-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.widget-title {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--primary);
	}

	.widget-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
		color: var(--primary);
	}

	.widget-header-actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	:global(.widget:hover) .widget-header-actions {
		opacity: 1;
	}

	.header-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		color: var(--on-surface-dim);
		cursor: pointer;
		transition:
			color 0.15s ease,
			background 0.15s ease;
	}

	.header-btn:hover {
		color: var(--on-surface);
		background: var(--overlay-white-10);
	}
</style>
