import { bookmarks } from "$lib/state/bookmarks.svelte";

const STATUS_TIMEOUT = 3000;

export function useImportExport() {
	let importStatus = $state<string | null>(null);
	let statusTimer: ReturnType<typeof setTimeout> | undefined;

	function showStatus(message: string) {
		clearTimeout(statusTimer);
		importStatus = message;
		statusTimer = setTimeout(() => {
			importStatus = null;
		}, STATUS_TIMEOUT);
	}

	function exportJson(compressed: boolean) {
		bookmarks.exportJson(compressed);
	}

	async function importJsonFile(file: File) {
		const success = await bookmarks.importJson(file);
		showStatus(success ? "Импорт успешен!" : "Ошибка импорта");
	}

	async function importHtmlFile(file: File) {
		const success = await bookmarks.importNetscapeHtml(file);
		showStatus(success ? "Импорт HTML успешен!" : "Ошибка импорта HTML");
	}

	return {
		get importStatus() {
			return importStatus;
		},
		exportJson,
		importJsonFile,
		importHtmlFile,
	};
}
