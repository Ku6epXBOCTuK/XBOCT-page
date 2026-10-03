<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		value?: string;
		id?: string;
		options: Option[];
	}

	let { value = $bindable(""), id, options }: Props = $props();
</script>

<select class="select" {id} bind:value>
	{#each options as opt (opt.value)}
		<option value={opt.value}>{opt.label}</option>
	{/each}
</select>

<style>
	.select {
		padding: var(--space-sm) var(--space-md);
		background: var(--overlay-white-5);
		border: 1px solid var(--overlay-white-10);
		border-radius: var(--radius-lg);
		color: var(--on-surface);
		font-size: var(--text-sm);
	}

	.select:focus {
		outline: none;
		border-color: var(--primary);
	}
</style>
