<script lang="ts">
	import type { Bookmark, Group } from "$lib/state/bookmarks.svelte";
	import { bookmarks as bookmarksState } from "$lib/state/bookmarks.svelte";
	import { getDomain } from "$lib/url";
	import { iconOptions } from "$lib/icons";
	import { fetchPageInfo } from "$lib/services/bookmarks";
	import Dialog from "$cmp/Dialog.svelte";
	import IconButton from "$cmp/IconButton.svelte";
	import ArrowDownIcon from "~icons/lucide/arrow-down";
	import ArrowUpIcon from "~icons/lucide/arrow-up";
	import PencilIcon from "~icons/lucide/pencil";
	import PlusIcon from "~icons/lucide/plus";
	import TrashIcon from "~icons/lucide/trash-2";
	import BookmarkEditDialog from "./BookmarkEditDialog.svelte";

	interface Props {
		group: Group;
		onSave: (group: Group) => void;
		onCancel: () => void;
		onDelete: () => void;
	}

	let { group, onSave, onCancel, onDelete }: Props = $props();

	let name = $state(group.name);
	let icon = $state(group.icon || "");
	let bookmarks = $state<Bookmark[]>([...group.bookmarks]);

	let newUrl = $state("");
	let loadingUrls = $state<Set<string>>(new Set());

	let editingBookmarkId: string | null = $state(null);
	let editingBookmark: Bookmark | null = $state(null);

	function handleSave() {
		onSave({
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

<Dialog title="Редактирование группы" onclose={onCancel}>
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
			<button class="add-url-btn" onclick={addBookmarkByUrl}>Добавить</button>
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
						<IconButton
							icon={ArrowUpIcon}
							disabled={index === 0}
							onClick={() => moveBookmark(index, -1)}
							title="Вверх"
						/>
						<IconButton
							icon={ArrowDownIcon}
							disabled={index === bookmarks.length - 1}
							onClick={() => moveBookmark(index, 1)}
							title="Вниз"
						/>
						<IconButton
							icon={PencilIcon}
							onClick={() => openBookmarkEdit(bookmark)}
							title="Редактировать"
						/>
						<IconButton
							icon={TrashIcon}
							variant="danger"
							onClick={() => removeBookmark(bookmark.id)}
							title="Удалить"
						/>
					</div>
				</div>
			{/each}
		</div>
		<button class="add-btn" onclick={addBookmark}>
			<PlusIcon />
			Добавить закладку
		</button>
	</div>

	<div class="dialog-footer">
		<button class="delete-group-btn" onclick={onDelete}>Удалить группу</button>
		<div class="footer-right">
			<button class="cancel-btn" onclick={onCancel}>Отмена</button>
			<button class="save-btn" onclick={handleSave}>Сохранить</button>
		</div>
	</div>
</Dialog>

{#if editingBookmark && editingBookmarkId}
	<BookmarkEditDialog
		bookmark={editingBookmark}
		onSave={handleBookmarkSave}
		onCancel={handleBookmarkCancel}
		onDelete={() => handleBookmarkDelete(editingBookmarkId!)}
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

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background: transparent;
		border: 1px dashed var(--overlay-white-20);
		border-radius: 0.5rem;
		color: var(--on-surface-dim);
		font-size: 0.875rem;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.add-btn:hover {
		border-color: var(--primary);
		color: var(--primary);
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

	.delete-group-btn {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--danger);
		border-radius: 0.5rem;
		color: var(--danger);
		font-size: 0.875rem;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.delete-group-btn:hover {
		background: var(--danger-alpha);
	}

	.cancel-btn {
		padding: 0.5rem 1rem;
		background: var(--overlay-white-10);
		border: none;
		border-radius: 0.5rem;
		color: var(--on-surface);
		font-size: 0.875rem;
		cursor: pointer;
	}

	.cancel-btn:hover {
		background: var(--overlay-white-15);
	}

	.save-btn {
		padding: 0.5rem 1rem;
		background: var(--primary);
		border: none;
		border-radius: 0.5rem;
		color: var(--on-surface-inverse);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.save-btn:hover {
		opacity: 0.9;
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

	.add-url-btn {
		padding: 0.5rem 1rem;
		background: var(--primary);
		border: none;
		border-radius: 0.5rem;
		color: var(--on-surface-inverse);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}

	.add-url-btn:hover {
		opacity: 0.9;
	}

	.bookmark-title.loading {
		font-style: italic;
		opacity: 0.7;
	}
</style>
