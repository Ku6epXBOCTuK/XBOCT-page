<script lang="ts">
	import { nanoid } from "nanoid";
	import type { Column, Group } from "@/types/bookmarks";
	import Background from "./page/Background.svelte";
	import Header from "./page/Header.svelte";
	import Stats from "./page/Stats.svelte";
	import ColumnsGrid from "./page/ColumnsGrid.svelte";
	import FAB from "./page/FAB.svelte";

	const DEFAULT_COLUMNS: Column[] = [
		{ id: nanoid(), order: 0 },
		{ id: nanoid(), order: 1 },
		{ id: nanoid(), order: 2 },
	];

	let columns = $state<Column[]>(DEFAULT_COLUMNS);
	let groups = $state<Group[]>([
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[0].id,
			order: 0,
			name: "Essential Tools",
			bookmarks: [
				{
					id: nanoid(),
					title: "Google Drive",
					url: "https://drive.google.com",
					createdAt: Date.now(),
				},
				{
					id: nanoid(),
					title: "Gmail",
					url: "https://gmail.com",
					createdAt: Date.now(),
				},
				{
					id: nanoid(),
					title: "Google Calendar",
					url: "https://calendar.google.com",
					createdAt: Date.now(),
				},
			],
		},
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[0].id,
			order: 1,
			name: "AI Lab",
			bookmarks: [
				{
					id: nanoid(),
					title: "ChatGPT",
					url: "https://chat.openai.com",
					createdAt: Date.now(),
				},
				{
					id: nanoid(),
					title: "Claude",
					url: "https://claude.ai",
					createdAt: Date.now(),
				},
			],
		},
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[1].id,
			order: 0,
			name: "Dev Hub",
			bookmarks: [
				{
					id: nanoid(),
					title: "GitHub",
					url: "https://github.com",
					createdAt: Date.now(),
				},
				{
					id: nanoid(),
					title: "Stack Overflow",
					url: "https://stackoverflow.com",
					createdAt: Date.now(),
				},
				{
					id: nanoid(),
					title: "MDN",
					url: "https://developer.mozilla.org",
					createdAt: Date.now(),
				},
			],
		},
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[2].id,
			order: 0,
			name: "Social",
			bookmarks: [
				{
					id: nanoid(),
					title: "Twitter",
					url: "https://twitter.com",
					createdAt: Date.now(),
				},
				{
					id: nanoid(),
					title: "LinkedIn",
					url: "https://linkedin.com",
					createdAt: Date.now(),
				},
			],
		},
	]);

	let totalBookmarks = $derived(
		groups.reduce((acc, g) => acc + g.bookmarks.length, 0),
	);

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
		<ColumnsGrid {columns} {groups} />
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
