<script lang="ts">
	import Dialog from "$cmp/layout/Dialog.svelte";
	import DialogFooter from "$cmp/layout/DialogFooter.svelte";
	import FormField from "$cmp/ui/FormField.svelte";
	import TextInput from "$cmp/ui/TextInput.svelte";
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
	// svelte-ignore state_referenced_locally
	let hidden = $state(bookmark.hidden ?? false);

	function handleSave() {
		if (!title.trim() || !url.trim()) return;
		onsave({
			...bookmark,
			title: title.trim(),
			url: url.trim(),
			hidden: hidden || undefined,
		});
	}
</script>

<Dialog title="Редактирование закладки" onclose={oncancel}>
	{#if bookmark.favicon}
		<div class="favicon-preview">
			<img src={bookmark.favicon} alt="" />
		</div>
	{/if}

	<FormField label="Название" for="bookmark-title">
		<TextInput id="bookmark-title" bind:value={title} placeholder="Название" />
	</FormField>

	<FormField label="URL" for="bookmark-url">
		<TextInput
			id="bookmark-url"
			type="url"
			bind:value={url}
			placeholder="https://example.com"
		/>
	</FormField>

	<label class="checkbox-label">
		<input type="checkbox" bind:checked={hidden} />
		Скрытая
	</label>

	<DialogFooter {oncancel} onsave={handleSave} {ondelete} />
</Dialog>

<style>
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--on-surface);
		cursor: pointer;
	}

	.favicon-preview {
		display: flex;
		justify-content: center;
		padding: var(--space-lg);
		background: var(--overlay-white-3);
		border-radius: var(--radius-lg);
	}

	.favicon-preview img {
		width: var(--size-favicon-lg);
		height: var(--size-favicon-lg);
		object-fit: contain;
	}
</style>
