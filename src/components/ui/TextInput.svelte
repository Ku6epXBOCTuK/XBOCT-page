<script lang="ts">
	interface Props {
		value?: string;
		id?: string;
		type?: "text" | "url";
		placeholder?: string;
		flex?: boolean;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		value = $bindable(""),
		id,
		type = "text",
		placeholder,
		flex = false,
		onkeydown,
	}: Props = $props();
</script>

<input
	class="text-input"
	class:flex
	{id}
	{type}
	bind:value
	{placeholder}
	{onkeydown}
/>

<style>
	.text-input {
		padding: var(--space-sm) var(--space-md);
		background: var(--overlay-white-5);
		border: 1px solid var(--overlay-white-10);
		border-radius: var(--radius-lg);
		color: var(--on-surface);
		font-size: var(--text-sm);
	}

	.text-input.flex {
		flex: 1;
	}

	.text-input:focus {
		outline: none;
		border-color: var(--primary);
	}
</style>
