import {
	dailyFileName,
	dayKey,
	getStoredHandle,
	LATEST_FILE,
	pickBackupDirectory,
	rotateDailyFiles,
	storeHandle,
	writeFileInDir,
} from "$lib/services/backup";
import { toJson } from "$lib/services/bookmarksStorage";
import { untrack } from "svelte";
import { bookmarks } from "./bookmarks.svelte";

const INSTANT_DEBOUNCE_MS = 2000;
const PERMISSION_OPTS = { mode: "readwrite" } as const;
const DIR_KEY = "backupDir";
const LAST_INSTANT_KEY = "xboct:lastBackupAt:instant";
const LAST_DAILY_KEY = "xboct:lastBackupDay";

function createBackupState() {
	let dir: FileSystemDirectoryHandle | null = null;
	let dirName = $state<string | null>(null);
	let lastInstantAt = $state<number | null>(null);
	let lastDailyDay = $state<string | null>(null);
	let initialized = $state(false);

	let instantTimer: ReturnType<typeof setTimeout> | undefined;
	let writePending = false;
	let writing = false;
	let firstRun = true;

	function currentJson(): string {
		return JSON.stringify(
			toJson(bookmarks.getGroups(), bookmarks.getColumns()),
			null,
			2,
		);
	}

	async function performWrites(): Promise<void> {
		if (!dir || writing) return;
		writing = true;
		try {
			const content = currentJson();
			await writeFileInDir(dir, LATEST_FILE, content);
			lastInstantAt = Date.now();
			localStorage.setItem(LAST_INSTANT_KEY, String(lastInstantAt));

			const today = dayKey();
			if (lastDailyDay !== today) {
				await writeFileInDir(dir, dailyFileName(), content);
				lastDailyDay = today;
				localStorage.setItem(LAST_DAILY_KEY, today);
				await rotateDailyFiles(dir);
			}
		} finally {
			writing = false;
		}
	}

	async function tryWrite(userGesture = false): Promise<boolean> {
		if (!dir) return false;
		try {
			if ((await dir.queryPermission(PERMISSION_OPTS)) === "granted") {
				await performWrites();
				return true;
			}
			if (
				userGesture &&
				(await dir.requestPermission(PERMISSION_OPTS)) === "granted"
			) {
				await performWrites();
				return true;
			}
		} catch (e) {
			console.error("[backup] Failed:", e);
		}
		return false;
	}

	function scheduleInstantWrite() {
		if (!dir) return;
		clearTimeout(instantTimer);
		instantTimer = setTimeout(() => {
			void flush();
		}, INSTANT_DEBOUNCE_MS);
	}

	async function flush(userGesture = false) {
		writePending = !(await tryWrite(userGesture));
	}

	async function init() {
		dir = await getStoredHandle(DIR_KEY);
		dirName = dir?.name ?? null;
		lastInstantAt = Number(localStorage.getItem(LAST_INSTANT_KEY)) || null;
		lastDailyDay = localStorage.getItem(LAST_DAILY_KEY);
		initialized = true;

		if (dir && lastDailyDay !== dayKey()) {
			await flush(false);
		}

		$effect.root(() => {
			$effect(() => {
				bookmarks.getGroups();
				untrack(() => {
					if (firstRun) {
						firstRun = false;
						return;
					}
					scheduleInstantWrite();
				});
			});
		});
	}

	async function flushPending() {
		if (writePending) await flush(true);
	}

	async function chooseFolder() {
		const picked = await pickBackupDirectory();
		if (!picked) return;
		await storeHandle(DIR_KEY, picked);
		dir = picked;
		dirName = picked.name;
		await performWrites();
	}

	return {
		get initialized() {
			return initialized;
		},
		get configured() {
			return dirName !== null;
		},
		get dirName() {
			return dirName;
		},
		get lastInstantAt() {
			return lastInstantAt;
		},
		get lastDailyDay() {
			return lastDailyDay;
		},
		init,
		tryWrite,
		flushPending,
		chooseFolder,
	};
}

export const backup = createBackupState();
