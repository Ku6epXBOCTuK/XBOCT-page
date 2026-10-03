<script lang="ts">
	import SearchIcon from "~icons/lucide/search";

	interface Props {
		onsearch?: (query: string) => void;
	}

	let { onsearch }: Props = $props();
	let value = $state("");

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		onsearch?.(value);
	}
</script>

<div class="search">
	<SearchIcon class="search-icon" />
	<input
		class="search-input"
		type="text"
		placeholder="Search..."
		{value}
		oninput={handleInput}
	/>
</div>

<style>
	.search {
		position: relative;
		width: var(--search-width);
	}

	.search :global(.search-icon) {
		position: absolute;
		left: var(--space-md);
		top: 50%;
		transform: translateY(-50%);
		color: var(--on-surface-variant);
		opacity: 0.7;
	}

	.search-input {
		width: 100%;
		padding: var(--space-xs) var(--space-md) var(--space-xs) var(--space-2xl);
		background: var(--surface-variant-alpha);
		border: none;
		border-radius: var(--radius-md);
		color: var(--on-surface);
		font-size: var(--text-sm);
		outline: none;
		transition: box-shadow var(--transition-normal);
	}

	.search-input::placeholder {
		color: var(--on-surface-variant);
		opacity: 0.5;
	}

	.search-input:focus {
		box-shadow: var(--shadow-focus);
	}
</style>
