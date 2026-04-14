<script lang="ts">
	import type { Component } from "svelte";
	import Button from "$cmp/ui/Button.svelte";
	import MoreVerticalIcon from "~icons/lucide/more-vertical";
	import PencilIcon from "~icons/lucide/pencil";

	interface Props {
		name: string;
		icon?: Component;
		onedit?: () => void;
		onmenu?: () => void;
	}

	let { name, icon: Icon, onedit, onmenu }: Props = $props();
</script>

<div class="widget-header">
	<h2 class="widget-title">{name}</h2>
	<div class="widget-header-right">
		<div class="widget-header-actions">
			<Button
				icon={PencilIcon}
				title="Редактировать"
				onclick={onedit}
				size="mini"
				variant="ghost"
			/>
			<Button
				icon={MoreVerticalIcon}
				title="Меню"
				onclick={onmenu}
				size="mini"
				variant="ghost"
			/>
		</div>
		{#if Icon}
			<div class="widget-icon">
				<Icon />
			</div>
		{/if}
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
</style>
