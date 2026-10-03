const DB_NAME = "xboct-backup";
const STORE = "handles";
const HANDLE_KEY = "backupFile";

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

export async function getStoredHandle(): Promise<FileSystemFileHandle | null> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(STORE, "readonly")
			.objectStore(STORE)
			.get(HANDLE_KEY);
		request.onsuccess = () => resolve(request.result ?? null);
		request.onerror = () => reject(request.error);
	});
}

export async function storeHandle(handle: FileSystemFileHandle): Promise<void> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(STORE, "readwrite")
			.objectStore(STORE)
			.put(handle, HANDLE_KEY);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function pickBackupFile(): Promise<FileSystemFileHandle | null> {
	try {
		return await window.showSaveFilePicker({
			suggestedName: "xboct-bookmarks-backup.json",
			types: [
				{ description: "JSON", accept: { "application/json": [".json"] } },
			],
		});
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") return null;
		throw e;
	}
}

export async function writeToFile(
	handle: FileSystemFileHandle,
	content: string,
): Promise<void> {
	const writable = await handle.createWritable();
	await writable.write(content);
	await writable.close();
}
