<script lang="ts">
	import type { Bookmark } from "@/state/bookmarks.svelte";
	import XIcon from "~icons/lucide/x";

	interface Props {
		bookmark: Bookmark;
		onSave: (bookmark: Bookmark) => void;
		onCancel: () => void;
		onDelete: () => void;
	}

	let { bookmark, onSave, onCancel, onDelete }: Props = $props();

	// svelte-ignore state_referenced_locally
	let title = $state(bookmark.title);
	// svelte-ignore state_referenced_locally
	let url = $state(bookmark.url);

	function handleSave() {
		if (!title.trim() || !url.trim()) return;
		onSave({ ...bookmark, title: title.trim(), url: url.trim() });
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
			<h2>Редактирование закладки</h2>
			<button class="close-btn" onclick={onCancel}>
				<XIcon />
			</button>
		</div>

		<div class="dialog-content">
			{#if bookmark.favicon}
				<div class="favicon-preview">
					<img src={bookmark.favicon} alt="" />
				</div>
			{/if}

			<div class="form-group">
				<label for="bookmark-title">Название</label>
				<input
					id="bookmark-title"
					type="text"
					bind:value={title}
					placeholder="Название"
				/>
			</div>

			<div class="form-group">
				<label for="bookmark-url">URL</label>
				<input
					id="bookmark-url"
					type="url"
					bind:value={url}
					placeholder="https://example.com"
				/>
			</div>
		</div>

		<div class="dialog-footer">
			<button class="delete-btn" onclick={onDelete}>Удалить</button>
			<div class="footer-right">
				<button class="cancel-btn" onclick={onCancel}>Отмена</button>
				<button class="save-btn" onclick={handleSave}>Сохранить</button>
			</div>
		</div>
	</div>
</div>

<style>
	.dialog-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--overlay-black-70);
		z-index: 1001;
	}

	.dialog {
		width: 90%;
		max-width: 400px;
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
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.favicon-preview {
		display: flex;
		justify-content: center;
		padding: 1rem;
		background: var(--overlay-white-3);
		border-radius: 0.5rem;
	}

	.favicon-preview img {
		width: 32px;
		height: 32px;
		object-fit: contain;
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

	.form-group input {
		padding: 0.5rem 0.75rem;
		background: var(--overlay-white-5);
		border: 1px solid var(--overlay-white-10);
		border-radius: 0.5rem;
		color: var(--on-surface);
		font-size: 0.875rem;
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--primary);
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

	.delete-btn {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--danger);
		border-radius: 0.5rem;
		color: var(--danger);
		font-size: 0.875rem;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.delete-btn:hover {
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
