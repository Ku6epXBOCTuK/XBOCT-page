<script lang="ts">
	import Button from "$cmp/ui/Button.svelte";
	import CheckIcon from "~icons/lucide/check";
	import TrashIcon from "~icons/lucide/trash-2";
	import XIcon from "~icons/lucide/x";

	interface Props {
		oncancel: () => void;
		onsave: () => void;
		ondelete?: () => void;
		deleteLabel?: string;
		cancelLabel?: string;
		saveLabel?: string;
	}

	let {
		oncancel,
		onsave,
		ondelete,
		deleteLabel = "Удалить",
		cancelLabel = "Отмена",
		saveLabel = "Сохранить",
	}: Props = $props();
</script>

<div class="dialog-footer">
	{#if ondelete}
		<Button
			label={deleteLabel}
			icon={TrashIcon}
			variant="danger"
			onclick={ondelete}
		/>
	{:else}
		<span></span>
	{/if}
	<div class="footer-right">
		<Button
			label={cancelLabel}
			icon={XIcon}
			variant="secondary"
			onclick={oncancel}
		/>
		<Button
			label={saveLabel}
			icon={CheckIcon}
			variant="primary"
			onclick={onsave}
		/>
	</div>
</div>

<style>
	.dialog-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: var(--space-lg);
		border-top: 1px solid var(--overlay-white-10);
	}

	.footer-right {
		display: flex;
		gap: var(--space-sm);
	}
</style>
