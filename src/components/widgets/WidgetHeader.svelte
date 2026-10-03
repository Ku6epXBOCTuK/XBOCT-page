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
		menuButtonRef?: HTMLElement;
	}

	let {
		name,
		icon: Icon,
		onedit,
		onmenu,
		menuButtonRef = $bindable(),
	}: Props = $props();
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
				bind:buttonRef={menuButtonRef}
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
		padding-bottom: var(--space-2xs);
		margin-bottom: var(--space-sm);
		border-bottom: 1px solid var(--overlay-white-5);
	}

	.widget-header-right {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.widget-title {
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		color: var(--primary);
	}

	.widget-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size-icon-sm);
		height: var(--size-icon-sm);
		color: var(--primary);
	}

	.widget-header-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		opacity: 0;
		transition: opacity var(--transition-fast);
	}

	:global(.widget:hover) .widget-header-actions {
		opacity: 1;
	}
</style>
