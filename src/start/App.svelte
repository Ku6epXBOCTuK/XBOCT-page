<script lang="ts">
	import type { Column, Group } from "@/types/bookmarks";
	import { nanoid } from "nanoid";
	import Plus from "~icons/lucide/plus";
	import Search from "~icons/lucide/search";
	import Settings from "~icons/lucide/settings";

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
	let sortedColumns = $derived(columns.toSorted((a, b) => a.order - b.order));

	function getGroupsByColumn(columnId: string): Group[] {
		return groups
			.filter((g) => g.columnId === columnId)
			.toSorted((a, b) => a.order - b.order);
	}

	function openBookmark(url: string): void {
		window.open(url, "_blank");
	}
</script>

<div class="start-page">
	<div class="background-effects">
		<div class="glow glow-primary"></div>
		<div class="glow glow-secondary"></div>
		<div class="texture"></div>
	</div>

	<header class="header">
		<div class="header-left">
			<span class="logo">XBOCT</span>
			<div class="search-wrapper">
				<Search class="search-icon" />
				<input class="search-input" type="text" placeholder="Search..." />
			</div>
		</div>
		<div class="header-right">
			<button class="icon-button">
				<Settings class="settings-icon" />
			</button>
		</div>
	</header>

	<main class="main">
		<section class="stats">
			<h1>My Bookmarks</h1>
			<span class="stats-count">{totalBookmarks} bookmarks</span>
		</section>

		<div class="columns">
			{#each sortedColumns as column (column.id)}
				<div class="column">
					{#each getGroupsByColumn(column.id) as group (group.id)}
						<div class="widget glass-panel">
							<div class="widget-header">
								<h2 class="widget-title">{group.name}</h2>
							</div>
							<div class="widget-content">
								{#each group.bookmarks as bookmark (bookmark.id)}
									<button
										class="bookmark-link"
										onclick={() => openBookmark(bookmark.url)}
									>
										<span class="bookmark-title">{bookmark.title}</span>
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</main>

	<button class="fab">
		<Plus />
	</button>
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

	.background-effects {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.glow {
		position: absolute;
		border-radius: 9999px;
		filter: blur(100px);
	}

	.glow-primary {
		top: 0;
		right: 0;
		width: 40%;
		height: 40%;
		background: var(--primary);
		opacity: 0.05;
	}

	.glow-secondary {
		bottom: 0;
		left: 0;
		width: 30%;
		height: 30%;
		background: var(--secondary);
		opacity: 0.05;
	}

	.texture {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		opacity: 0.03;
		mix-blend-mode: overlay;
	}

	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1.5rem;
		background: rgba(12, 14, 18, 0.6);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.logo {
		font-size: 1.125rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		color: var(--on-surface);
	}

	.search-wrapper {
		position: relative;
		width: 20rem;
	}

	.search-wrapper :global(.search-icon) {
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

	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		color: var(--on-surface-variant);
		cursor: pointer;
		transition: background 0.2s;
	}

	.icon-button:hover {
		background: var(--surface-variant);
	}

	.main {
		position: relative;
		z-index: 1;
		max-width: 1920px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
	}

	.stats {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.stats h1 {
		font-size: 1.125rem;
		font-weight: 700;
	}

	.stats-count {
		font-size: 0.75rem;
		color: var(--on-surface-variant);
		opacity: 0.6;
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.glass-panel {
		backdrop-filter: blur(12px);
		background: rgba(23, 26, 31, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 0.5rem;
	}

	.widget {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
	}

	.widget-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.25rem;
		margin-bottom: 0.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.widget-title {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--primary);
	}

	.widget-content {
		display: flex;
		flex-direction: column;
	}

	.bookmark-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.375rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		color: var(--on-surface-variant);
		font-size: 0.75rem;
		text-align: left;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.bookmark-link:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--on-surface);
	}

	.fab {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary);
		color: var(--on-primary);
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.15s,
			box-shadow 0.15s;
		z-index: 50;
	}

	.fab:hover {
		transform: scale(1.1);
	}

	.fab:active {
		transform: scale(0.95);
	}
</style>
