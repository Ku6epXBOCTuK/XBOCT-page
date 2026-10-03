<script lang="ts">
	import Dialog from "$cmp/layout/Dialog.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import { useImportExport } from "$lib/composables/useImportExport.svelte";
	import { backup } from "$lib/state/backup.svelte";
	import DownloadIcon from "~icons/lucide/download";
	import FileJsonIcon from "~icons/lucide/file-json";
	import FolderIcon from "~icons/lucide/folder";
	import SaveIcon from "~icons/lucide/save";
	import UploadIcon from "~icons/lucide/upload";

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();

	const importExport = useImportExport();

	let jsonFileInput: HTMLInputElement | null = $state(null);
	let htmlFileInput: HTMLInputElement | null = $state(null);
	let compressed = $state(false);

	function handleFileChange(
		e: Event,
		confirmMessage: string,
		importFile: (file: File) => void,
	) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		target.value = "";
		if (!file) return;
		if (confirm(confirmMessage)) importFile(file);
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
			<Button
				label="Экспорт"
				icon={DownloadIcon}
				variant="secondary"
				onclick={() => importExport.exportJson(compressed)}
			/>
		</div>

		<div class="buttons-row">
			<Button
				label="Импорт JSON"
				icon={UploadIcon}
				variant="secondary"
				onclick={() => jsonFileInput?.click()}
			/>
			<Button
				label="Импорт HTML"
				icon={FolderIcon}
				variant="secondary"
				onclick={() => htmlFileInput?.click()}
			/>
		</div>

		<input
			type="file"
			accept=".json"
			bind:this={jsonFileInput}
			onchange={(e) =>
				handleFileChange(
					e,
					"Заменить все текущие закладки на закладки из файла?",
					(file) => importExport.importJsonFile(file),
				)}
			hidden
		/>
		<input
			type="file"
			accept=".html"
			bind:this={htmlFileInput}
			onchange={(e) =>
				handleFileChange(
					e,
					"Заменить все текущие закладки на закладки из HTML-файла?",
					(file) => importExport.importHtmlFile(file),
				)}
			hidden
		/>

		{#if importExport.importStatus}
			<p class="import-status">{importExport.importStatus}</p>
		{/if}
	</div>

	<div class="section">
		<h3 class="section-title">Бэкап</h3>
		<p class="section-desc">
			Автоматическое сохранение копии раз в день в выбранный файл
		</p>

		{#if backup.fileName}
			<p class="backup-info">Файл: {backup.fileName}</p>
			<p class="backup-info">
				Последний бэкап: {backup.lastBackupAt
					? new Date(backup.lastBackupAt).toLocaleString()
					: "никогда"}
			</p>
		{/if}

		<div class="buttons-row">
			<Button
				label={backup.configured ? "Изменить файл" : "Выбрать файл"}
				icon={FileJsonIcon}
				variant="secondary"
				onclick={() => backup.chooseFile()}
			/>
			{#if backup.configured}
				<Button
					label="Сохранить сейчас"
					icon={SaveIcon}
					variant="secondary"
					onclick={() => backup.writeNow()}
				/>
			{/if}
		</div>
	</div>
</Dialog>

<style>
	.section {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: 600;
		margin: 0;
	}

	.section-desc {
		font-size: var(--text-xs);
		color: var(--on-surface-dim);
		margin: 0;
	}

	.buttons-row {
		display: flex;
		gap: var(--space-md);
	}

	.backup-info {
		font-size: var(--text-xs);
		color: var(--on-surface-variant);
		margin: 0;
	}

	.import-status {
		font-size: var(--text-xs);
		color: var(--primary);
		text-align: center;
		margin: 0;
	}
</style>
