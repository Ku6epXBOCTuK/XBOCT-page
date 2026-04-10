<script lang="ts">
	import type { Bookmark, Group } from "@/state/bookmarks.svelte";
	import type { Component } from "svelte";
	import ArrowDownIcon from "~icons/lucide/arrow-down";
	import ArrowUpIcon from "~icons/lucide/arrow-up";
	import BrainIcon from "~icons/lucide/brain";
	import BriefcaseIcon from "~icons/lucide/briefcase";
	import CodeIcon from "~icons/lucide/code";
	import Gamepad2Icon from "~icons/lucide/gamepad-2";
	import PencilIcon from "~icons/lucide/pencil";
	import PlusIcon from "~icons/lucide/plus";
	import TrashIcon from "~icons/lucide/trash-2";
	import UsersIcon from "~icons/lucide/users";
	import XIcon from "~icons/lucide/x";
	import BookmarkEditDialog from "./BookmarkEditDialog.svelte";

	interface Props {
		group: Group;
		onSave: (group: Group) => void;
		onCancel: () => void;
		onDelete: () => void;
	}

	let { group, onSave, onCancel, onDelete }: Props = $props();

	// svelte-ignore state_referenced_locally
	let name = $state(group.name);
	// svelte-ignore state_referenced_locally
	let icon = $state(group.icon || "");
	// svelte-ignore state_referenced_locally
	let bookmarks = $state<Bookmark[]>([...group.bookmarks]);

	let editingBookmarkId: string | null = $state(null);
	let editingBookmark: Bookmark | null = $state(null);

	const iconOptions: {
		value: string;
		icon: Component | null;
		label: string;
	}[] = [
		{ value: "", icon: null, label: "Без иконки" },
		{ value: "briefcase", icon: BriefcaseIcon, label: "Briefcase" },
		{ value: "brain", icon: BrainIcon, label: "Brain" },
		{ value: "code", icon: CodeIcon, label: "Code" },
		{ value: "users", icon: UsersIcon, label: "Users" },
		{ value: "gamepad-2", icon: Gamepad2Icon, label: "Gamepad" },
	];

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
		};
		editingBookmark = newBookmark;
		editingBookmarkId = newBookmark.id;
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
		if (
			editingBookmark &&
			!group.bookmarks.find((b) => b.id === editingBookmark!.id)
		) {
			// Добавленная но не сохраненная - удаляем
		}
		editingBookmarkId = null;
		editingBookmark = null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") onCancel();
	}
</script>

<div class="dialog-overlay" onclick={onCancel} role="presentation">
	<div
		class="dialog"
		onclick={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onkeydown={handleKeydown}
	>
		<div class="dialog-header">
			<h2>Редактирование группы</h2>
			<button class="close-btn" onclick={onCancel}>
				<XIcon />
			</button>
		</div>

		<div class="dialog-content">
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
				<div id="bookmarks-list" class="bookmarks-list">
					{#each bookmarks as bookmark, index (bookmark.id)}
						<div class="bookmark-item">
							{#if bookmark.favicon}
								<img src={bookmark.favicon} alt="" class="bookmark-favicon" />
							{/if}
							<span
								class="bookmark-title"
								contenteditable="true"
								oninput={(e) => {
									const target = e.target as HTMLElement;
									bookmark.title = target.innerText;
								}}
							>
								{bookmark.title}
							</span>
							<div class="bookmark-actions">
								<button
									class="action-btn"
									disabled={index === 0}
									onclick={() => moveBookmark(index, -1)}
									title="Вверх"
								>
									<ArrowUpIcon />
								</button>
								<button
									class="action-btn"
									disabled={index === bookmarks.length - 1}
									onclick={() => moveBookmark(index, 1)}
									title="Вниз"
								>
									<ArrowDownIcon />
								</button>
								<button
									class="action-btn"
									onclick={() => openBookmarkEdit(bookmark)}
									title="Редактировать"
								>
									<PencilIcon />
								</button>
								<button
									class="action-btn delete"
									onclick={() => removeBookmark(bookmark.id)}
									title="Удалить"
								>
									<TrashIcon />
								</button>
							</div>
						</div>
					{/each}
				</div>
				<button class="add-btn" onclick={addBookmark}>
					<PlusIcon />
					Добавить закладку
				</button>
			</div>
		</div>

		<div class="dialog-footer">
			<button class="delete-group-btn" onclick={onDelete}>Удалить группу</button
			>
			<div class="footer-right">
				<button class="cancel-btn" onclick={onCancel}>Отмена</button>
				<button class="save-btn" onclick={handleSave}>Сохранить</button>
			</div>
		</div>
	</div>
</div>

{#if editingBookmark && editingBookmarkId}
	<BookmarkEditDialog
		bookmark={editingBookmark}
		onSave={handleBookmarkSave}
		onCancel={handleBookmarkCancel}
		onDelete={() => handleBookmarkDelete(editingBookmarkId!)}
	/>
{/if}

<style>
	.dialog-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--overlay-black-70);
		z-index: 1000;
	}

	.dialog {
		width: 90%;
		max-width: 480px;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		background: var(--surface);
		border: 1px solid var(--overlay-white-10);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid var(--overlay-white-10);
	}

	.dialog-header h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		color: var(--on-surface-dim);
		cursor: pointer;
	}

	.close-btn:hover {
		background: var(--overlay-white-10);
		color: var(--on-surface);
	}

	.dialog-content {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

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

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		color: var(--on-surface-dim);
		cursor: pointer;
	}

	.action-btn:hover:not(:disabled) {
		background: var(--overlay-white-10);
		color: var(--on-surface);
	}

	.action-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.action-btn.delete:hover {
		color: var(--danger);
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
		padding: 1rem;
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
</style>
