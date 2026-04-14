<script lang="ts">
	import Dialog from "$cmp/layout/Dialog.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import { iconOptions } from "$lib/icons";
	import { fetchPageInfo } from "$lib/services/bookmarks";
	import type { Bookmark, Group } from "$lib/state/bookmarks.svelte";
	import { bookmarks as bookmarksState } from "$lib/state/bookmarks.svelte";
	import { getDomain } from "$lib/url";
	import ArrowDownIcon from "~icons/lucide/arrow-down";
	import ArrowUpIcon from "~icons/lucide/arrow-up";
	import CheckIcon from "~icons/lucide/check";
	import PencilIcon from "~icons/lucide/pencil";
	import PlusIcon from "~icons/lucide/plus";
	import TrashIcon from "~icons/lucide/trash-2";
	import XIcon from "~icons/lucide/x";
	import BookmarkEditDialog from "./BookmarkEditDialog.svelte";

	interface Props {
		group: Group;
		onsave: (group: Group) => void;
		oncancel: () => void;
		ondelete: () => void;
	}

	let { group, onsave, oncancel, ondelete }: Props = $props();

	// svelte-ignore state_referenced_locally
	let name = $state(group.name);
	// svelte-ignore state_referenced_locally
	let icon = $state(group.icon || "");
	// svelte-ignore state_referenced_locally
	let bookmarks = $state<Bookmark[]>([...group.bookmarks]);

	let newUrl = $state("");
	let loadingUrls = $state<Set<string>>(new Set());

	let editingBookmarkId: string | null = $state(null);
	let editingBookmark: Bookmark | null = $state(null);

	function handleSave() {
		onsave({
			...group,
			name,
			icon: icon || undefined,
			bookmarks: bookmarks.filter((b) => b.title.trim()),
		});
	}

	function addBookmark() {
		const newBookmark: Bookmark = {
			id: crypto.randomUUID(),
			title: "",
			url: "",
			favicon: "",
		};
		editingBookmark = newBookmark;
		editingBookmarkId = newBookmark.id;
	}

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

	function openBookmarkEdit(bookmark: Bookmark) {
		editingBookmark = { ...bookmark };
		editingBookmarkId = bookmark.id;
	}

	function handleBookmarkSave(updated: Bookmark) {
		if (updated.title.trim() && updated.url.trim()) {
			bookmarks = bookmarks.map((b) => (b.id === updated.id ? updated : b));
		}
		editingBookmarkId = null;
		editingBookmark = null;
	}

	function handleBookmarkDelete(id: string) {
		bookmarks = bookmarks.filter((b) => b.id !== id);
		editingBookmarkId = null;
		editingBookmark = null;
	}

	function handleBookmarkCancel() {
		editingBookmarkId = null;
		editingBookmark = null;
	}
</script>

<Dialog title="Редактирование группы" onclose={oncancel}>
	<div class="form-group">
		<label for="group-name">Название</label>
		<input
			id="group-name"
			type="text"
			bind:value={name}
			placeholder="Название группы"
		/>
	</div>

	<div class="form-group">
		<label for="group-icon">Иконка</label>
		<select id="group-icon" bind:value={icon}>
			{#each iconOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
	</div>

	<div class="form-group">
		<label for="bookmarks-list">Закладки</label>
		<div class="url-input-row">
			<input
				type="url"
				id="new-url"
				bind:value={newUrl}
				placeholder="https://example.com"
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
				<div class="bookmark-item">
					{#if bookmark.favicon}
						<img src={bookmark.favicon} alt="" class="bookmark-favicon" />
					{/if}
					<span
						class="bookmark-title"
						class:loading={loadingUrls.has(bookmark.id)}
						contenteditable="true"
						oninput={(e) => {
							const target = e.target as HTMLElement;
							bookmark.title = target.innerText;
						}}
					>
						{bookmark.title}
					</span>
					<div class="bookmark-actions">
						<Button
							icon={ArrowUpIcon}
							disabled={index === 0}
							onclick={() => moveBookmark(index, -1)}
							title="Вверх"
							size="mini"
							variant="ghost"
						/>
						<Button
							icon={ArrowDownIcon}
							disabled={index === bookmarks.length - 1}
							onclick={() => moveBookmark(index, 1)}
							title="Вниз"
							size="mini"
							variant="ghost"
						/>
						<Button
							icon={PencilIcon}
							onclick={() => openBookmarkEdit(bookmark)}
							title="Редактировать"
							size="mini"
							variant="ghost"
						/>
						<Button
							icon={TrashIcon}
							variant="danger"
							onclick={() => removeBookmark(bookmark.id)}
							title="Удалить"
							size="mini"
						/>
					</div>
				</div>
			{/each}
		</div>
		<Button
			label="Добавить закладку"
			variant="ghost"
			icon={PlusIcon}
			onclick={addBookmark}
		/>
	</div>

	<div class="dialog-footer">
		<Button
			label="Удалить группу"
			icon={TrashIcon}
			variant="danger"
			onclick={ondelete}
		/>
		<div class="footer-right">
			<Button
				label="Отмена"
				icon={XIcon}
				variant="secondary"
				onclick={oncancel}
			/>
			<Button
				label="Сохранить"
				icon={CheckIcon}
				variant="primary"
				onclick={handleSave}
			/>
		</div>
	</div>
</Dialog>

{#if editingBookmark && editingBookmarkId}
	<BookmarkEditDialog
		bookmark={editingBookmark}
		onsave={handleBookmarkSave}
		oncancel={handleBookmarkCancel}
		ondelete={() => handleBookmarkDelete(editingBookmarkId!)}
	/>
{/if}

<style>
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--on-surface-dim);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.form-group input[type="text"],
	.form-group select {
		padding: 0.5rem 0.75rem;
		background: var(--overlay-white-5);
		border: 1px solid var(--overlay-white-10);
		border-radius: 0.5rem;
		color: var(--on-surface);
		font-size: 0.875rem;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: var(--primary);
	}

	.bookmarks-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.bookmark-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: var(--overlay-white-3);
		border-radius: 0.5rem;
	}

	.bookmark-favicon {
		width: 20px;
		height: 20px;
		object-fit: contain;
		flex-shrink: 0;
	}

	.bookmark-title {
		flex: 1;
		min-width: 0;
		font-size: 0.875rem;
		color: var(--on-surface);
		outline: none;
		padding: 0.25rem;
		border-radius: 0.25rem;
		border: 1px solid transparent;
	}

	.bookmark-title:focus {
		border-color: var(--primary);
		background: var(--overlay-white-5);
	}

	.bookmark-actions {
		display: flex;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	.dialog-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 1rem;
		border-top: 1px solid var(--overlay-white-10);
	}

	.footer-right {
		display: flex;
		gap: 0.5rem;
	}

	.url-input-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.url-input-row input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		background: var(--overlay-white-5);
		border: 1px solid var(--overlay-white-10);
		border-radius: 0.5rem;
		color: var(--on-surface);
		font-size: 0.875rem;
	}

	.url-input-row input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.bookmark-title.loading {
		font-style: italic;
		opacity: 0.7;
	}
</style>
