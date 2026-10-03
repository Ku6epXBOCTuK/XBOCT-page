<script lang="ts">
	import Background from "$cmp/layout/Background.svelte";
	import Header from "$cmp/layout/Header.svelte";
	import Stats from "$cmp/layout/Stats.svelte";
	import ColumnsGrid from "$cmp/widgets/ColumnsGrid.svelte";
	import BookmarkGhost from "$cmp/widgets/BookmarkGhost.svelte";
	import DragGhost from "$cmp/widgets/DragGhost.svelte";
	import { logMouseEvent } from "$lib/logger";
	import { backup } from "$lib/state/backup.svelte";
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import { dnd } from "$lib/state/dnd.svelte";
	import { DragDropProvider, DragOverlay } from "@dnd-kit/svelte";
	import { onMount } from "svelte";
	import "../vars.css";
	import "./style.css";

	onMount(() => {
		bookmarks.load();
		backup.init().then(() => backup.backupDailyIfDue());
		window.addEventListener("click", (e) => logMouseEvent(e, "click"));
		window.addEventListener("mouseup", (e) => logMouseEvent(e, "mouseup"));
		window.addEventListener("click", () => backup.flushPending(), {
			once: true,
		});
	});

	let totalBookmarks = $derived(bookmarks.getTotalBookmarks());

	function handleSearch(query: string) {
		console.log("Search:", query);
	}
</script>

<svelte:head>
	<title>{import.meta.env.DEV ? "[DEV] " : ""}XBOCT-page</title>
</svelte:head>

<div class="start-page">
	<Background />

	<Header onsearch={handleSearch} />

	<main class="main">
		<Stats count={totalBookmarks} />
		<DragDropProvider
			onDragEnd={dnd.ondragend}
			onDragStart={dnd.ondragstart}
			onDragMove={dnd.ondragover}
			onDragOver={dnd.ondragover}
		>
			<ColumnsGrid />
			{#if dnd.activeData?.group}
				<DragOverlay>
					<DragGhost group={dnd.activeData.group} />
				</DragOverlay>
			{:else if dnd.activeData?.bookmark}
				<DragOverlay>
					<BookmarkGhost bookmark={dnd.activeData.bookmark} />
				</DragOverlay>
			{/if}
		</DragDropProvider>
	</main>
</div>

<style>
	.start-page {
		min-height: 100vh;
		background: var(--surface);
		color: var(--on-surface);
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		position: relative;
	}

	.main {
		position: relative;
		z-index: var(--z-main);
		max-width: var(--page-max-width);
		margin: 0 auto;
		padding: var(--space-lg) var(--space-xl);
	}
</style>
