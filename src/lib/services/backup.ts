const DB_NAME = "xboct-backup";
const STORE = "handles";

export const LATEST_FILE = "xboct-latest.json";

const DAILY_FILE_RE = /^xboct-(\d{4})-(\d{2})-(\d{2})\.json$/;
const DAY_MS = 24 * 60 * 60 * 1000;
const KEEP_DAYS = 3;
const KEEP_WEEKS = 5;
const KEEP_MONTHS = 12;

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			request.result.createObjectStore(STORE);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function getStoredHandle(
	key: string,
): Promise<FileSystemDirectoryHandle | null> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(STORE, "readonly")
			.objectStore(STORE)
			.get(key);
		request.onsuccess = () => resolve(request.result ?? null);
		request.onerror = () => reject(request.error);
	});
}

export async function storeHandle(
	key: string,
	handle: FileSystemDirectoryHandle,
): Promise<void> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(STORE, "readwrite")
			.objectStore(STORE)
			.put(handle, key);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function pickBackupDirectory(): Promise<FileSystemDirectoryHandle | null> {
	try {
		return await window.showDirectoryPicker({ mode: "readwrite" });
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") return null;
		throw e;
	}
}

export async function writeFileInDir(
	dir: FileSystemDirectoryHandle,
	name: string,
	content: string,
): Promise<void> {
	const handle = await dir.getFileHandle(name, { create: true });
	const writable = await handle.createWritable();
	await writable.write(content);
	await writable.close();
}

export function dayKey(d: Date = new Date()): string {
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${m}-${day}`;
}

export function dailyFileName(d: Date = new Date()): string {
	return `xboct-${dayKey(d)}.json`;
}

function isoWeekKey(d: Date): string {
	const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	const dayNum = date.getUTCDay() || 7;
	date.setUTCDate(date.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
	const week = Math.ceil(
		((date.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7,
	);
	return `${date.getUTCFullYear()}-W${week}`;
}

function monthKey(d: Date): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthsBetween(a: Date, b: Date): number {
	return (
		(a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth())
	);
}

interface DatedFile {
	name: string;
	date: Date;
}

// Ротация: все файлы за последние KEEP_DAYS дней, далее по одному (новейшему)
// на ISO-неделю за KEEP_WEEKS недель и на месяц за KEEP_MONTHS месяцев
export async function rotateDailyFiles(
	dir: FileSystemDirectoryHandle,
	now: Date = new Date(),
): Promise<void> {
	const files: DatedFile[] = [];
	for await (const [name, handle] of dir.entries()) {
		if (handle.kind !== "file") continue;
		const m = DAILY_FILE_RE.exec(name);
		if (!m) continue;
		files.push({
			name,
			date: new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])),
		});
	}

	const tiers = [
		{
			key: dayKey,
			within: (d: Date) => now.getTime() - d.getTime() < KEEP_DAYS * DAY_MS,
		},
		{
			key: isoWeekKey,
			within: (d: Date) =>
				now.getTime() - d.getTime() < KEEP_WEEKS * 7 * DAY_MS,
		},
		{
			key: monthKey,
			within: (d: Date) => monthsBetween(now, d) < KEEP_MONTHS,
		},
	];

	const remaining = new Map(files.map((f) => [f.name, f]));
	for (const tier of tiers) {
		const byKey = new Map<string, DatedFile>();
		for (const f of remaining.values()) {
			if (!tier.within(f.date)) continue;
			const k = tier.key(f.date);
			const cur = byKey.get(k);
			if (!cur || f.date > cur.date) byKey.set(k, f);
		}
		for (const f of byKey.values()) remaining.delete(f.name);
	}

	for (const name of remaining.keys()) {
		await dir.removeEntry(name);
	}
}
