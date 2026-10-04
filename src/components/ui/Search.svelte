<script lang="ts">
	import type { Bookmark } from "$lib/state/bookmarks.svelte";
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import { search } from "$lib/state/search.svelte";
	import SearchIcon from "~icons/lucide/search";
	import SearchResults from "./SearchResults.svelte";

	let activeIndex = $state(0);
	let focused = $state(false);

	let results = $derived(
		search.active
			? bookmarks
					.getGroups()
					.flatMap((g) => g.bookmarks)
					.filter((b) => search.matchesBookmark(b))
			: [],
	);

	let listOpen = $derived(focused && results.length > 0);

	$effect(() => {
		void results;
		activeIndex = 0;
	});

	function openResult(bookmark: Bookmark) {
		window.open(bookmark.url, "_blank", "noopener,noreferrer");
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "ArrowDown" && results.length > 0) {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % results.length;
		} else if (e.key === "ArrowUp" && results.length > 0) {
			e.preventDefault();
			activeIndex = (activeIndex - 1 + results.length) % results.length;
		} else if (e.key === "Enter" && listOpen) {
			openResult(results[activeIndex]);
		} else if (e.key === "Escape") {
			search.query = "";
		}
	}
</script>

<div class="search">
	<SearchIcon class="search-icon" />
	<input
		class="search-input"
		type="text"
		placeholder="Search..."
		role="combobox"
		aria-expanded={listOpen}
		aria-controls="search-results"
		bind:value={search.query}
		onfocus={() => (focused = true)}
		onblur={() => (focused = false)}
		onkeydown={handleKeydown}
	/>
	{#if listOpen}
		<SearchResults
			{results}
			{activeIndex}
			onselect={openResult}
			onhover={(i) => (activeIndex = i)}
		/>
	{/if}
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
