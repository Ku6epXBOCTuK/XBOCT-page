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
		{ id: nanoid(), order: 3 },
	];

	let columns = $state<Column[]>(DEFAULT_COLUMNS);
	let groups = $state<Group[]>([
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[0].id,
			order: 0,
			name: "Essential Tools",
			icon: "briefcase",
			bookmarks: [
				{
					id: nanoid(),
					title: "Google Drive",
					url: "https://drive.google.com",
				},
				{ id: nanoid(), title: "Gmail", url: "https://gmail.com" },
				{
					id: nanoid(),
					title: "Google Calendar",
					url: "https://calendar.google.com",
				},
			],
		},
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[0].id,
			order: 1,
			name: "AI Lab",
			icon: "brain",
			bookmarks: [
				{ id: nanoid(), title: "ChatGPT", url: "https://chat.openai.com" },
				{ id: nanoid(), title: "Claude", url: "https://claude.ai" },
			],
		},
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[1].id,
			order: 0,
			name: "Dev Hub",
			icon: "code",
			bookmarks: [
				{ id: nanoid(), title: "GitHub", url: "https://github.com" },
				{
					id: nanoid(),
					title: "Stack Overflow",
					url: "https://stackoverflow.com",
				},
				{ id: nanoid(), title: "MDN", url: "https://developer.mozilla.org" },
			],
		},
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[2].id,
			order: 0,
			name: "Social",
			icon: "users",
			bookmarks: [
				{ id: nanoid(), title: "Twitter", url: "https://twitter.com" },
				{ id: nanoid(), title: "LinkedIn", url: "https://linkedin.com" },
			],
		},
		{
			id: nanoid(),
			columnId: DEFAULT_COLUMNS[3].id,
			order: 0,
			name: "Entertainment",
			icon: "gamepad-2",
			bookmarks: [
				{ id: nanoid(), title: "YouTube", url: "https://youtube.com" },
				{ id: nanoid(), title: "Twitch", url: "https://twitch.tv" },
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

	function onUpdateGroup(updatedGroup: Group) {
		groups = groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
	}

	function onDeleteGroup(id: string) {
		groups = groups.filter((g) => g.id !== id);
	}
</script>

<div class="start-page">
	<Background />

	<Header onSearch={handleSearch} />

	<main class="main">
		<Stats count={totalBookmarks} />
		<ColumnsGrid {columns} {groups} {onUpdateGroup} {onDeleteGroup} />
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
