<script lang="ts">
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import Dialog from "$cmp/Dialog.svelte";
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
			<button class="action-btn" onclick={handleExport}>
				<DownloadIcon />
				Экспорт
			</button>
			<button class="action-btn" onclick={handleImportClick}>
				<UploadIcon />
				Импорт
			</button>
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

	.action-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--overlay-white-5);
		border: 1px solid var(--overlay-white-10);
		border-radius: 0.5rem;
		color: var(--on-surface);
		font-size: 0.875rem;
		cursor: pointer;
		transition: background 0.15s;
	}

	.action-btn:hover {
		background: var(--overlay-white-10);
	}

	.import-status {
		font-size: 0.75rem;
		color: var(--primary);
		text-align: center;
		margin: 0;
	}
</style>
