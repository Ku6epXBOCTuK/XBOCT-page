<script lang="ts">
	import "../vars.css";
	import "./style.css";
	import { bookmarks } from "@/state/bookmarks.svelte";
	import { onMount } from "svelte";
	import Background from "./page/Background.svelte";
	import ColumnsGrid from "./page/ColumnsGrid.svelte";
	import Header from "./page/Header.svelte";
	import Stats from "./page/Stats.svelte";
	import { DragDropProvider, DragOverlay } from "@dnd-kit/svelte";

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
		activeData = event.operation.source?.data as DragData;
		activeOverId = undefined;
		console.log("[DND] drag start", activeId, activeData);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onDragOver(event: any) {
		activeOverId = event.operation.target?.id as string;
		console.log("[DND] drag over", activeOverId);
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
		console.log("[DND] groups:", groups.length);

		if (activeIdStr.startsWith("group:")) {
			const groupId = activeIdStr.replace("group:", "");
			console.log("[DND] moving group:", groupId, "to:", overIdStr);

			if (overIdStr.startsWith("column:")) {
				const columnId = overIdStr.replace("column:", "");
				console.log("[DND] drop on column:", columnId);
				const columns = bookmarks.getColumns();
				const targetColumn = columns.find((c) => c.id === columnId);
				if (!targetColumn) return;
				const columnGroups = groups
					.filter((g) => g.columnId === targetColumn.id)
					.toSorted((a, b) => a.order - b.order);
				console.log("[DND] column has groups:", columnGroups.length);
				bookmarks.moveGroup(groupId, targetColumn.id, columnGroups.length);
			} else if (overIdStr.startsWith("group-widget:")) {
				const targetGroupId = overIdStr.replace("group-widget:", "");
				console.log("[DND] drop on group-widget:", targetGroupId);
				const targetGroup = groups.find((g) => g.id === targetGroupId);
				if (!targetGroup) return;

				const columnGroups = groups
					.filter((g) => g.columnId === targetGroup.columnId)
					.toSorted((a, b) => a.order - b.order);
				const targetIndex = columnGroups.findIndex(
					(g) => g.id === targetGroupId,
				);
				console.log("[DND] target index:", targetIndex);
				bookmarks.moveGroup(groupId, targetGroup.columnId, targetIndex);
			}
		} else if (activeIdStr.startsWith("bookmark:")) {
			const parts = activeIdStr.split(":");
			const bookmarkId = parts[1];
			const fromGroupId = parts[2];

			if (overIdStr.startsWith("group:")) {
				const toGroupId = overIdStr.replace("group:", "");
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
		<DragDropProvider {onDragEnd} {onDragStart} {onDragOver}>
			<ColumnsGrid {activeId} {activeOverId} />
			{#if activeData?.group}
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
