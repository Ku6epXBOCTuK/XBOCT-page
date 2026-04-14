<script lang="ts">
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import Dialog from "$cmp/layout/Dialog.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import DownloadIcon from "~icons/lucide/download";
	import UploadIcon from "~icons/lucide/upload";

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();

	let fileInput: HTMLInputElement | null = $state(null);
	let importStatus = $state<string | null>(null);
	let compressed = $state(false);

	function handleExport() {
		bookmarks.exportJson(compressed);
	}

	function handleImportClick() {
		fileInput?.click();
	}

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const confirmed = confirm(
			"Заменить все текущие закладки на закладки из файла?",
		);
		if (!confirmed) {
			target.value = "";
			return;
		}

		const success = await bookmarks.importJson(file);
		if (success) {
			importStatus = "Импорт успешен!";
			setTimeout(() => {
				importStatus = null;
			}, 3000);
		} else {
			importStatus = "Ошибка импорта";
			setTimeout(() => {
				importStatus = null;
			}, 3000);
		}

		target.value = "";
	}
</script>

<Dialog title="Настройки" {onclose}>
	<div class="section">
		<h3 class="section-title">Импорт / Экспорт</h3>
		<p class="section-desc">Сохраните или восстановите ваши закладки</p>

		<label class="checkbox-label">
			<input type="checkbox" bind:checked={compressed} />
			Сжать JSON
		</label>

		<div class="buttons-row">
			<Button variant="secondary" onclick={handleExport}>
				<DownloadIcon />
				Экспорт
			</Button>
			<Button variant="secondary" onclick={handleImportClick}>
				<UploadIcon />
				Импорт
			</Button>
		</div>

		<input
			type="file"
			accept=".json"
			bind:this={fileInput}
			onchange={handleFileChange}
			hidden
		/>

		{#if importStatus}
			<p class="import-status">{importStatus}</p>
		{/if}
	</div>
</Dialog>

<style>
	.section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.section-title {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0;
	}

	.section-desc {
		font-size: 0.75rem;
		color: var(--on-surface-dim);
		margin: 0;
	}

	.buttons-row {
		display: flex;
		gap: 0.75rem;
	}

	.import-status {
		font-size: 0.75rem;
		color: var(--primary);
		text-align: center;
		margin: 0;
	}
</style>
