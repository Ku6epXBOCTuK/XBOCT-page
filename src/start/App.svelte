<script lang="ts">
	import { bookmarks } from "@/state/bookmarks";
	import Background from "./page/Background.svelte";
	import Header from "./page/Header.svelte";
	import Stats from "./page/Stats.svelte";
	import ColumnsGrid from "./page/ColumnsGrid.svelte";
	import FAB from "./page/FAB.svelte";

	let totalBookmarks = $derived(bookmarks.getTotalBookmarks());

	function handleSearch(query: string) {
		console.log("Search:", query);
	}

	function handleAddClick() {
		console.log("Add clicked");
	}
</script>

<div class="start-page">
	<Background />

	<Header onSearch={handleSearch} />

	<main class="main">
		<Stats count={totalBookmarks} />
		<ColumnsGrid />
	</main>

	<FAB onclick={handleAddClick} />
</div>

<style>
	.start-page {
		min-height: 100vh;
		background: var(--surface);
		color: var(--on-surface);
		font-family: "Inter", sans-serif;
		font-size: 0.875rem;
		position: relative;
	}

	.main {
		position: relative;
		z-index: 1;
		max-width: 1920px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
	}
</style>
