<script lang="ts">
	import SearchIcon from "~icons/lucide/search";

	interface Props {
		onSearch?: (query: string) => void;
	}

	let { onSearch }: Props = $props();
	let value = $state("");

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		onSearch?.(value);
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
		width: 20rem;
	}

	.search :global(.search-icon) {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--on-surface-variant);
		opacity: 0.7;
	}

	.search-input {
		width: 100%;
		padding: 0.375rem 0.75rem 0.375rem 2.25rem;
		background: rgba(35, 38, 44, 0.4);
		border: none;
		border-radius: 0.375rem;
		color: var(--on-surface);
		font-size: 0.875rem;
		outline: none;
		transition: box-shadow 0.2s;
	}

	.search-input::placeholder {
		color: var(--on-surface-variant);
		opacity: 0.5;
	}

	.search-input:focus {
		box-shadow: 0 0 0 1px rgba(129, 236, 255, 0.4);
	}
</style>
