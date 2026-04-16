<script lang="ts">
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import Dialog from "$cmp/layout/Dialog.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import DownloadIcon from "~icons/lucide/download";
	import FolderIcon from "~icons/lucide/folder";
	import UploadIcon from "~icons/lucide/upload";

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();

	let jsonFileInput: HTMLInputElement | null = $state(null);
	let htmlFileInput: HTMLInputElement | null = $state(null);
	let importStatus = $state<string | null>(null);
	let compressed = $state(false);

	function handleExport() {
		bookmarks.exportJson(compressed);
	}

	function handleJsonImportClick() {
		jsonFileInput?.click();
	}

	function handleHtmlImportClick() {
		htmlFileInput?.click();
	}

	async function handleJsonFileChange(e: Event) {
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

	async function handleHtmlFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const confirmed = confirm(
			"Заменить все текущие закладки на закладки из HTML-файла?",
		);
		if (!confirmed) {
			target.value = "";
			return;
		}

		const success = await bookmarks.importNetscapeHtml(file);
		if (success) {
			importStatus = "Импорт HTML успешен!";
			setTimeout(() => {
				importStatus = null;
			}, 3000);
		} else {
			importStatus = "Ошибка импорта HTML";
			setTimeout(() => {
				importStatus = null;
			}, 3000);
		}

		target.value = "";
	}
</script>

<Dialog title="Настройки" {onclose}>
	<div class="section">
		<h3 class="section-title">Импорт / Эксппорт</h3>
		<p class="section-desc">Сохраните или восстановите ваши закладки</p>

		<label class="checkbox-label">
			<input type="checkbox" bind:checked={compressed} />
			Сжать JSON
		</label>

		<div class="buttons-row">
			<Button
				label="Экспорт"
				icon={DownloadIcon}
				variant="secondary"
				onclick={handleExport}
			/>
		</div>

		<div class="buttons-row">
			<Button
				label="Импорт JSON"
				icon={UploadIcon}
				variant="secondary"
				onclick={handleJsonImportClick}
			/>
			<Button
				label="Импорт HTML"
				icon={FolderIcon}
				variant="secondary"
				onclick={handleHtmlImportClick}
			/>
		</div>

		<input
			type="file"
			accept=".json"
			bind:this={jsonFileInput}
			onchange={handleJsonFileChange}
			hidden
		/>

		<input
			type="file"
			accept=".html"
			bind:this={htmlFileInput}
			onchange={handleHtmlFileChange}
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
