<script lang="ts">
	import Popover from "$cmp/layout/Popover.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import type { Component } from "svelte";
	import BanIcon from "~icons/lucide/ban";
	import PencilIcon from "~icons/lucide/pencil";

	interface IconOption {
		value: string;
		icon: Component | null;
		label: string;
	}

	interface Props {
		value?: string;
		options: IconOption[];
		id?: string;
	}

	let { value = $bindable(""), options, id }: Props = $props();

	let open = $state(false);
	let buttonRef = $state<HTMLElement>();

	let SelectedIcon = $derived(
		options.find((opt) => opt.value === value)?.icon ?? null,
	);

	function select(iconValue: string) {
		value = iconValue;
		open = false;
	}
</script>

<div class="icon-picker" {id}>
	<span class="current-icon" class:empty={!SelectedIcon}>
		{#if SelectedIcon}
			<SelectedIcon />
		{:else}
			<BanIcon />
		{/if}
	</span>
	<Button
		label="Изменить"
		icon={PencilIcon}
		variant="secondary"
		bind:buttonRef
		onclick={() => (open = true)}
	/>
</div>

<Popover {open} anchorRef={buttonRef} onclose={() => (open = false)}>
	<div class="icon-grid" role="radiogroup">
		{#each options as opt (opt.value)}
			{@const Icon = opt.icon}
			<button
				type="button"
				class="icon-option"
				class:selected={value === opt.value}
				title={opt.label}
				role="radio"
				aria-checked={value === opt.value}
				onclick={() => select(opt.value)}
			>
				{#if Icon}
					<Icon />
				{:else}
					<BanIcon />
				{/if}
			</button>
		{/each}
	</div>
</Popover>

<style>
	.icon-picker {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.current-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size-icon-lg);
		height: var(--size-icon-lg);
		background: var(--overlay-white-5);
		border: 1px solid var(--overlay-white-10);
		border-radius: var(--radius-lg);
		color: var(--primary);
	}

	.current-icon.empty {
		color: var(--on-surface-dim);
	}

	.current-icon :global(svg) {
		width: var(--size-icon-md);
		height: var(--size-icon-md);
	}

	.icon-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		max-width: var(--ghost-max-width);
	}

	.icon-option {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size-icon-lg);
		height: var(--size-icon-lg);
		padding: 0;
		background: var(--overlay-white-5);
		border: 1px solid var(--overlay-white-10);
		border-radius: var(--radius-lg);
		color: var(--on-surface-variant);
		cursor: pointer;
		transition:
			background var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.icon-option:hover {
		background: var(--overlay-white-10);
		color: var(--on-surface);
	}

	.icon-option.selected {
		border-color: var(--primary);
		background: var(--primary-alpha);
		color: var(--primary);
	}

	.icon-option :global(svg) {
		width: var(--size-icon-md);
		height: var(--size-icon-md);
	}
</style>
