<script lang="ts">
	import Dialog from "$cmp/layout/Dialog.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import type { Bookmark } from "$lib/state/bookmarks.svelte";

	interface Props {
		bookmark: Bookmark;
		onsave: (bookmark: Bookmark) => void;
		oncancel: () => void;
		ondelete: () => void;
	}

	let { bookmark, onsave, oncancel, ondelete }: Props = $props();

	// svelte-ignore state_referenced_locally
	let title = $state(bookmark.title);
	// svelte-ignore state_referenced_locally
	let url = $state(bookmark.url);

	function handleSave() {
		if (!title.trim() || !url.trim()) return;
		onsave({ ...bookmark, title: title.trim(), url: url.trim() });
	}
</script>

<Dialog title="Редактирование закладки" onclose={oncancel}>
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

	<div class="dialog-footer">
		<Button variant="danger" onclick={ondelete}>Удалить</Button>
		<div class="footer-right">
			<Button variant="secondary" onclick={oncancel}>Отмена</Button>
			<Button variant="primary" onclick={handleSave}>Сохранить</Button>
		</div>
	</div>
</Dialog>

<style>
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
		padding-top: 1rem;
		border-top: 1px solid var(--overlay-white-10);
	}

	.footer-right {
		display: flex;
		gap: 0.5rem;
	}
</style>
