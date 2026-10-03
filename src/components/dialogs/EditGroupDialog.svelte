<script lang="ts">
	import Dialog from "$cmp/layout/Dialog.svelte";
	import DialogFooter from "$cmp/layout/DialogFooter.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import FormField from "$cmp/ui/FormField.svelte";
	import Select from "$cmp/ui/Select.svelte";
	import TextInput from "$cmp/ui/TextInput.svelte";
	import { iconOptions } from "$lib/icons";
	import type { Bookmark, Group } from "$lib/state/bookmarks.svelte";
	import PlusIcon from "~icons/lucide/plus";
	import BookmarkEditDialog from "./BookmarkEditDialog.svelte";
	import BookmarkListEditor from "./BookmarkListEditor.svelte";

	interface Props {
		group: Group;
		onsave: (group: Group) => void;
		oncancel: () => void;
		ondelete?: () => void;
	}

	let { group, onsave, oncancel, ondelete }: Props = $props();

	// svelte-ignore state_referenced_locally
	let name = $state(group.name);
	// svelte-ignore state_referenced_locally
	let icon = $state(group.icon || "");
	// svelte-ignore state_referenced_locally
	let bookmarks = $state<Bookmark[]>([...group.bookmarks]);

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
		editingBookmark = {
			id: crypto.randomUUID(),
			title: "",
			url: "",
			favicon: "",
		};
	}

	function openBookmarkEdit(bookmark: Bookmark) {
		editingBookmark = { ...bookmark };
	}

	function handleBookmarkSave(updated: Bookmark) {
		if (updated.title.trim() && updated.url.trim()) {
			const exists = bookmarks.some((b) => b.id === updated.id);
			bookmarks = exists
				? bookmarks.map((b) => (b.id === updated.id ? updated : b))
				: [...bookmarks, updated];
		}
		editingBookmark = null;
	}

	function handleBookmarkDelete(id: string) {
		bookmarks = bookmarks.filter((b) => b.id !== id);
		editingBookmark = null;
	}
</script>

<Dialog title="Редактирование группы" onclose={oncancel}>
	<FormField label="Название" for="group-name">
		<TextInput
			id="group-name"
			bind:value={name}
			placeholder="Название группы"
		/>
	</FormField>

	<FormField label="Иконка" for="group-icon">
		<Select id="group-icon" bind:value={icon} options={iconOptions} />
	</FormField>

	<FormField label="Закладки" for="bookmarks-list">
		<BookmarkListEditor bind:bookmarks onedit={openBookmarkEdit} />
		<Button
			label="Добавить закладку"
			variant="ghost"
			icon={PlusIcon}
			onclick={addBookmark}
		/>
	</FormField>

	<DialogFooter
		{oncancel}
		onsave={handleSave}
		{ondelete}
		deleteLabel="Удалить группу"
	/>
</Dialog>

{#if editingBookmark}
	<BookmarkEditDialog
		bookmark={editingBookmark}
		onsave={handleBookmarkSave}
		oncancel={() => (editingBookmark = null)}
		ondelete={() => handleBookmarkDelete(editingBookmark!.id)}
	/>
{/if}
