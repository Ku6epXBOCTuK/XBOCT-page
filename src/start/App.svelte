<script lang="ts">
	import Background from "$cmp/layout/Background.svelte";
	import ColumnsGrid from "$cmp/widgets/ColumnsGrid.svelte";
	import Header from "$cmp/layout/Header.svelte";
	import Stats from "$cmp/layout/Stats.svelte";
	import { bookmarks } from "@/state/bookmarks.svelte";
	import { Debug } from "@dnd-kit/dom/plugins/debug";
	import { DragDropProvider, DragOverlay } from "@dnd-kit/svelte";
	import { onMount } from "svelte";
	import "../vars.css";
	import "./style.css";

	interface DragData {
		group?: {
			id: string;
			name: string;
			icon?: string;
			bookmarks: Array<{
				id: string;
				title: string;
				url: string;
				favicon: string;
			}>;
		};
	}

	let activeData = $state<DragData | null>(null);

	onMount(() => {
		bookmarks.load();
	});

	let totalBookmarks = $derived(bookmarks.getTotalBookmarks());
	let activeId = $state<string | undefined>(undefined);
	let activeOverId = $state<string | undefined>(undefined);

	function handleSearch(query: string) {
		console.log("Search:", query);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onDragStart(event: any) {
		activeId = event.operation.source?.id as string;
		const sourceData = event.operation.source?.data;
		activeData = sourceData as DragData;
		activeOverId = undefined;
		console.log("[DND] drag start", activeId);
		console.log("[DND] source data:", sourceData);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onDragOver(event: any) {
		const over = event.operation.target;
		const container = event.operation.container;
		activeOverId = over?.id as string;
		console.log("[DND] drag over", {
			overId: over?.id,
			containerId: container?.id,
			activeId: event.operation.source?.id,
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onDragEnd(event: any) {
		const active = event.operation?.source;
		const over = event.operation?.target;
		console.log("[DND] onDragEnd", { active: active?.id, over: over?.id });

		activeId = undefined;
		activeOverId = undefined;

		if (!over || !active) return;

		const activeIdStr = active.id as string;
		const overIdStr = over.id as string;
		const groups = bookmarks.getGroups();
		const columns = bookmarks.getColumns();

		const isGroupActive = groups.some((g) => g.id === activeIdStr);
		const isGroupOver = groups.some((g) => g.id === overIdStr);

		if (isGroupActive) {
			const groupId = activeIdStr;
			console.log("[DND] moving group:", groupId, "to:", overIdStr);

			const targetGroup = groups.find((g) => g.id === groupId);
			if (!targetGroup) return;

			if (isGroupOver) {
				const target = groups.find((g) => g.id === overIdStr);
				if (!target) return;

				const columnGroups = groups
					.filter((g) => g.columnId === target.columnId)
					.toSorted((a, b) => a.order - b.order);
				const targetIndex = columnGroups.findIndex((g) => g.id === overIdStr);
				console.log("[DND] target index:", targetIndex);
				bookmarks.moveGroup(groupId, target.columnId, targetIndex);
			} else {
				const targetColumn = columns.find((c) => c.id === overIdStr);
				if (!targetColumn) return;
				const columnGroups = groups
					.filter((g) => g.columnId === targetColumn.id)
					.toSorted((a, b) => a.order - b.order);
				console.log("[DND] column has groups:", columnGroups.length);
				bookmarks.moveGroup(groupId, targetColumn.id, columnGroups.length);
			}
		} else if (activeIdStr.startsWith("bookmark:")) {
			const parts = activeIdStr.split(":");
			const bookmarkId = parts[1];
			const fromGroupId = parts[2];

			if (isGroupOver) {
				const toGroupId = overIdStr;
				const toGroup = groups.find((g) => g.id === toGroupId);
				if (!toGroup) return;
				bookmarks.moveBookmark(
					bookmarkId,
					fromGroupId,
					toGroupId,
					toGroup.bookmarks.length,
				);
			}
		}
	}
</script>

<div class="start-page">
	<Background />

	<Header onSearch={handleSearch} />

	<main class="main">
		<Stats count={totalBookmarks} />
		<DragDropProvider
			{onDragEnd}
			{onDragStart}
			{onDragOver}
			plugins={(defaults) => [Debug, ...defaults]}
		>
			<ColumnsGrid {activeId} {activeOverId} />
			{#if activeData?.group}
				{console.log("[DND] rendering ghost, activeData:", activeData)}
				<DragOverlay>
					{#snippet children(source)}
						{@const data = source.data as DragData}
						{@const g = data?.group}
						<div class="ghost-widget">
							<div class="ghost-header">
								<h2 class="widget-title">{g?.name ?? "Unknown"}</h2>
							</div>
							<div class="ghost-bookmarks">
								{#each g?.bookmarks?.slice(0, 3) ?? [] as bookmark (bookmark.id)}
									<div class="ghost-bookmark">
										<span class="ghost-bookmark-title">{bookmark.title}</span>
									</div>
								{/each}
								{#if (g?.bookmarks?.length ?? 0) > 3}
									<div class="ghost-more">
										+{(g?.bookmarks?.length ?? 0) - 3} more
									</div>
								{/if}
							</div>
						</div>
					{/snippet}
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

	.ghost-widget {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		backdrop-filter: blur(12px);
		background: var(--surface-container-alpha);
		border: 2px dashed var(--primary);
		border-radius: 0.5rem;
		opacity: 0.8;
		pointer-events: none;
		min-width: 200px;
		max-width: 280px;
	}

	.ghost-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.25rem;
		margin-bottom: 0.5rem;
		border-bottom: 1px solid var(--overlay-white-5);
	}

	.widget-title {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--primary);
		margin: 0;
	}

	.ghost-bookmarks {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.ghost-bookmark {
		padding: 0.25rem 0.5rem;
		background: var(--overlay-white-5);
		border-radius: 0.25rem;
	}

	.ghost-bookmark-title {
		font-size: 0.75rem;
		color: var(--on-surface);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	.ghost-more {
		font-size: 0.625rem;
		color: var(--on-surface-variant);
		padding: 0.25rem 0.5rem;
		text-align: center;
	}
</style>
