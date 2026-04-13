<script lang="ts">
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import DownloadIcon from "~icons/lucide/download";
	import UploadIcon from "~icons/lucide/upload";
	import XIcon from "~icons/lucide/x";

	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();

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

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") onClose();
	}
</script>

<div class="dialog-overlay" onclick={onClose} role="presentation">
	<div
		class="dialog"
		onclick={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onkeydown={handleKeydown}
	>
		<div class="dialog-header">
			<h2>Настройки</h2>
			<button class="close-btn" onclick={onClose}>
				<XIcon />
			</button>
		</div>

		<div class="dialog-content">
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
		z-index: 1000;
	}

	.dialog {
		width: 90%;
		max-width: 400px;
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
	}

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
