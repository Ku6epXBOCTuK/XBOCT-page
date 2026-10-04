<script lang="ts">
	import Button from "$cmp/ui/Button.svelte";
	import type { Bookmark } from "$lib/state/bookmarks.svelte";
	import ArrowDownIcon from "~icons/lucide/arrow-down";
	import ArrowUpIcon from "~icons/lucide/arrow-up";
	import EyeIcon from "~icons/lucide/eye";
	import EyeOffIcon from "~icons/lucide/eye-off";
	import PencilIcon from "~icons/lucide/pencil";
	import TrashIcon from "~icons/lucide/trash-2";

	interface Props {
		bookmark: Bookmark;
		index: number;
		total: number;
		onmove: (index: number, direction: -1 | 1) => void;
		onedit: () => void;
		onremove: () => void;
	}

	let { bookmark, index, total, onmove, onedit, onremove }: Props = $props();
</script>

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
		<Button
			icon={ArrowUpIcon}
			disabled={index === 0}
			onclick={() => onmove(index, -1)}
			title="Вверх"
			size="mini"
			variant="ghost"
		/>
		<Button
			icon={ArrowDownIcon}
			disabled={index === total - 1}
			onclick={() => onmove(index, 1)}
			title="Вниз"
			size="mini"
			variant="ghost"
		/>
		<Button
			icon={bookmark.hidden ? EyeOffIcon : EyeIcon}
			onclick={() => (bookmark.hidden = bookmark.hidden ? undefined : true)}
			title="Скрытая"
			size="mini"
			variant="ghost"
		/>
		<Button
			icon={PencilIcon}
			onclick={onedit}
			title="Редактировать"
			size="mini"
			variant="ghost"
		/>
		<Button
			icon={TrashIcon}
			variant="danger"
			onclick={onremove}
			title="Удалить"
			size="mini"
		/>
	</div>
</div>

<style>
	.bookmark-item {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-sm) var(--space-md);
		background: var(--overlay-white-3);
		border-radius: var(--radius-lg);
	}

	.bookmark-favicon {
		width: var(--size-favicon-md);
		height: var(--size-favicon-md);
		object-fit: contain;
		flex-shrink: 0;
	}

	.bookmark-title {
		flex: 1;
		min-width: 0;
		font-size: var(--text-sm);
		color: var(--on-surface);
		outline: none;
		padding: var(--space-2xs);
		border-radius: var(--radius-sm);
		border: 1px solid transparent;
	}

	.bookmark-title:focus {
		border-color: var(--primary);
		background: var(--overlay-white-5);
	}

	.bookmark-actions {
		display: flex;
		gap: var(--space-2xs);
		flex-shrink: 0;
	}
</style>
