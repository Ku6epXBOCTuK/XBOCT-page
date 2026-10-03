<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		label: string;
		for?: string;
		children: Snippet;
	}

	let { label, for: htmlFor, children }: Props = $props();
</script>

<div class="form-field">
	<label for={htmlFor}>{label}</label>
	{@render children()}
</div>

<style>
	.form-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.form-field label {
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--on-surface-dim);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}
</style>
