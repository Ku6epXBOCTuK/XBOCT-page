<script lang="ts">
	import "../vars.css";
	import "./style.css";
	import { bookmarks } from "@/state/bookmarks.svelte";
	import { onMount } from "svelte";
	import Background from "./page/Background.svelte";
	import ColumnsGrid from "./page/ColumnsGrid.svelte";
	import Header from "./page/Header.svelte";
	import Stats from "./page/Stats.svelte";
	import { DragDropProvider } from "@dnd-kit/svelte";

	onMount(() => {
		bookmarks.load();
	});

	let totalBookmarks = $derived(bookmarks.getTotalBookmarks());

	function handleSearch(query: string) {
		console.log("Search:", query);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onDragEnd(event: any) {
		const active = event.operation?.source;
		const over = event.operation?.target;
		console.log("[DND] onDragEnd", { active: active?.id, over: over?.id });
		if (!over || !active) return;

		const activeId = active.id as string;
		const overId = over.id as string;
		const groups = bookmarks.getGroups();
		console.log("[DND] groups:", groups.length);

		if (activeId.startsWith("group:")) {
			const groupId = activeId.replace("group:", "");
			console.log("[DND] moving group:", groupId, "to:", overId);

			if (overId.startsWith("column:")) {
				const columnId = overId.replace("column:", "");
				console.log("[DND] drop on column:", columnId);
				const columns = bookmarks.getColumns();
				const targetColumn = columns.find((c) => c.id === columnId);
				if (!targetColumn) return;
				const columnGroups = groups
					.filter((g) => g.columnId === targetColumn.id)
					.toSorted((a, b) => a.order - b.order);
				console.log("[DND] column has groups:", columnGroups.length);
				bookmarks.moveGroup(groupId, targetColumn.id, columnGroups.length);
			} else if (overId.startsWith("group-widget:")) {
				const targetGroupId = overId.replace("group-widget:", "");
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
		} else if (activeId.startsWith("bookmark:")) {
			const parts = activeId.split(":");
			const bookmarkId = parts[1];
			const fromGroupId = parts[2];

			if (overId.startsWith("group:")) {
				const toGroupId = overId.replace("group:", "");
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
		<DragDropProvider {onDragEnd}>
			<ColumnsGrid />
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
</style>
