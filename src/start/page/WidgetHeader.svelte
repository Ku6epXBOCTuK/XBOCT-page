<script lang="ts">
	import type { Component } from "svelte";

	interface Props {
		name: string;
		icon?: Component;
	}

	let { name, icon: Icon }: Props = $props();
</script>

<div class="widget-header">
	<h2 class="widget-title">{name}</h2>
	{#if Icon}
		<div class="widget-icon">
			<Icon />
		</div>
	{/if}
</div>

<style>
	.widget-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.25rem;
		margin-bottom: 0.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
</style>
