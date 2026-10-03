import {
	getStoredHandle,
	pickBackupFile,
	storeHandle,
	writeToFile,
} from "$lib/services/backup";
import { toJson } from "$lib/services/bookmarksStorage";
import { bookmarks } from "./bookmarks.svelte";

const LAST_BACKUP_KEY = "xboct:lastBackupAt";
const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

const PERMISSION_OPTS = { mode: "readwrite" } as const;

function createBackupState() {
	let fileName = $state<string | null>(null);
	let lastBackupAt = $state<number | null>(null);
	let initialized = $state(false);
	let handle: FileSystemFileHandle | null = null;

	async function init() {
		handle = await getStoredHandle();
		fileName = handle?.name ?? null;
		const stored = localStorage.getItem(LAST_BACKUP_KEY);
		lastBackupAt = stored ? Number(stored) : null;
		initialized = true;
	}

	async function writeNow(): Promise<boolean> {
		if (!handle) return false;
		const data = toJson(bookmarks.getGroups(), bookmarks.getColumns());
		await writeToFile(handle, JSON.stringify(data, null, 2));
		lastBackupAt = Date.now();
		localStorage.setItem(LAST_BACKUP_KEY, String(lastBackupAt));
		return true;
	}

	async function chooseFile(): Promise<void> {
		const picked = await pickBackupFile();
		if (!picked) return;
		await storeHandle(picked);
		handle = picked;
		fileName = picked.name;
		await writeNow();
	}

	function isDue(): boolean {
		return (
			handle !== null &&
			(lastBackupAt === null || Date.now() - lastBackupAt > BACKUP_INTERVAL_MS)
		);
	}

	async function backupIfDue(userGesture = false): Promise<void> {
		if (!handle || !isDue()) return;
		try {
			if ((await handle.queryPermission(PERMISSION_OPTS)) === "granted") {
				await writeNow();
			} else if (
				userGesture &&
				(await handle.requestPermission(PERMISSION_OPTS)) === "granted"
			) {
				await writeNow();
			}
		} catch (e) {
			console.error("[backup] Failed:", e);
		}
	}

	return {
		get fileName() {
			return fileName;
		},
		get lastBackupAt() {
			return lastBackupAt;
		},
		get configured() {
			return fileName !== null;
		},
		get initialized() {
			return initialized;
		},
		init,
		chooseFile,
		writeNow,
		backupIfDue,
	};
}

export const backup = createBackupState();
