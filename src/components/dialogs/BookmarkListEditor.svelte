<script lang="ts">
	import Button from "$cmp/ui/Button.svelte";
	import TextInput from "$cmp/ui/TextInput.svelte";
	import { fetchPageInfo } from "$lib/services/bookmarks";
	import type { Bookmark } from "$lib/state/bookmarks.svelte";
	import { bookmarks as bookmarksState } from "$lib/state/bookmarks.svelte";
	import { getDomain } from "$lib/url";
	import PlusIcon from "~icons/lucide/plus";
	import BookmarkEditRow from "./BookmarkEditRow.svelte";

	interface Props {
		bookmarks: Bookmark[];
		onedit: (bookmark: Bookmark) => void;
	}

	let { bookmarks = $bindable(), onedit }: Props = $props();

	let newUrl = $state("");

	async function addBookmarkByUrl() {
		const url = newUrl.trim();
		if (!url) return;

		const pageInfo = await fetchPageInfo(url);
		const newBookmark: Bookmark = {
			id: crypto.randomUUID(),
			title: pageInfo.title || getDomain(url),
			url,
			favicon: pageInfo.favicon || bookmarksState.getFaviconUrl(url),
		};

		bookmarks = [...bookmarks, newBookmark];
		newUrl = "";
	}

	function removeBookmark(id: string) {
		bookmarks = bookmarks.filter((b) => b.id !== id);
	}

	function moveBookmark(index: number, direction: -1 | 1) {
		const newIndex = index + direction;
		if (newIndex < 0 || newIndex >= bookmarks.length) return;
		const newBookmarks = [...bookmarks];
		[newBookmarks[index], newBookmarks[newIndex]] = [
			newBookmarks[newIndex],
			newBookmarks[index],
		];
		bookmarks = newBookmarks;
	}
</script>

<div class="url-input-row">
	<TextInput
		id="new-url"
		type="url"
		bind:value={newUrl}
		placeholder="https://example.com"
		flex
		onkeydown={(e) => e.key === "Enter" && addBookmarkByUrl()}
	/>
	<Button
		label="Добавить"
		icon={PlusIcon}
		variant="primary"
		onclick={addBookmarkByUrl}
	/>
</div>
<div id="bookmarks-list" class="bookmarks-list">
	{#each bookmarks as bookmark, index (bookmark.id)}
		<BookmarkEditRow
			{bookmark}
			{index}
			total={bookmarks.length}
			onmove={moveBookmark}
			onedit={() => onedit(bookmark)}
			onremove={() => removeBookmark(bookmark.id)}
		/>
	{/each}
</div>

<style>
	.bookmarks-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.url-input-row {
		display: flex;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}
</style>
