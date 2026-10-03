import {
	getStoredHandle,
	pickBackupFile,
	storeHandle,
	writeToFile,
} from "$lib/services/backup";
import { toJson } from "$lib/services/bookmarksStorage";
import { untrack } from "svelte";
import { bookmarks } from "./bookmarks.svelte";

const DAY_MS = 24 * 60 * 60 * 1000;
const INSTANT_DEBOUNCE_MS = 2000;

const PERMISSION_OPTS = { mode: "readwrite" } as const;

export interface BackupSlot {
	readonly fileName: string | null;
	readonly lastBackupAt: number | null;
	readonly configured: boolean;
	init(): Promise<void>;
	chooseFile(): Promise<void>;
	tryWrite(userGesture?: boolean): Promise<boolean>;
	backupIfDue(intervalMs: number, userGesture?: boolean): Promise<void>;
}

function createSlot(
	idbKey: string,
	lastBackupKey: string,
	suggestedName: string,
): BackupSlot {
	let fileName = $state<string | null>(null);
	let lastBackupAt = $state<number | null>(null);
	let handle: FileSystemFileHandle | null = null;

	async function init() {
		handle = await getStoredHandle(idbKey);
		fileName = handle?.name ?? null;
		const stored = localStorage.getItem(lastBackupKey);
		lastBackupAt = stored ? Number(stored) : null;
	}

	async function writeNow(): Promise<void> {
		if (!handle) return;
		const data = toJson(bookmarks.getGroups(), bookmarks.getColumns());
		await writeToFile(handle, JSON.stringify(data, null, 2));
		lastBackupAt = Date.now();
		localStorage.setItem(lastBackupKey, String(lastBackupAt));
	}

	async function tryWrite(userGesture = false): Promise<boolean> {
		if (!handle) return false;
		try {
			if ((await handle.queryPermission(PERMISSION_OPTS)) === "granted") {
				await writeNow();
				return true;
			}
			if (
				userGesture &&
				(await handle.requestPermission(PERMISSION_OPTS)) === "granted"
			) {
				await writeNow();
				return true;
			}
		} catch (e) {
			console.error("[backup] Failed:", e);
		}
		return false;
	}

	async function chooseFile(): Promise<void> {
		const picked = await pickBackupFile(suggestedName);
		if (!picked) return;
		await storeHandle(idbKey, picked);
		handle = picked;
		fileName = picked.name;
		await writeNow();
	}

	function isDue(intervalMs: number): boolean {
		return (
			handle !== null &&
			(lastBackupAt === null || Date.now() - lastBackupAt > intervalMs)
		);
	}

	async function backupIfDue(
		intervalMs: number,
		userGesture = false,
	): Promise<void> {
		if (!isDue(intervalMs)) return;
		await tryWrite(userGesture);
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
		init,
		chooseFile,
		tryWrite,
		backupIfDue,
	};
}

function createBackupState() {
	const daily = createSlot(
		"backupFile:daily",
		"xboct:lastBackupAt:daily",
		"xboct-bookmarks-daily.json",
	);
	const instant = createSlot(
		"backupFile:instant",
		"xboct:lastBackupAt:instant",
		"xboct-bookmarks-instant.json",
	);

	let initialized = $state(false);
	let instantPending = false;
	let instantTimer: ReturnType<typeof setTimeout> | undefined;
	let firstRun = true;

	async function init() {
		await Promise.all([daily.init(), instant.init()]);
		initialized = true;
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

	function scheduleInstantWrite() {
		if (!instant.configured) return;
		clearTimeout(instantTimer);
		instantTimer = setTimeout(() => {
			void tryInstantWrite();
		}, INSTANT_DEBOUNCE_MS);
	}

	async function tryInstantWrite(userGesture = false) {
		instantPending = !(await instant.tryWrite(userGesture));
	}

	async function flushPending() {
		await daily.backupIfDue(DAY_MS, true);
		if (instantPending) await tryInstantWrite(true);
	}

	return {
		get initialized() {
			return initialized;
		},
		get configured() {
			return daily.configured || instant.configured;
		},
		daily,
		instant,
		init,
		backupDailyIfDue: (userGesture = false) =>
			daily.backupIfDue(DAY_MS, userGesture),
		flushPending,
	};
}

export const backup = createBackupState();
