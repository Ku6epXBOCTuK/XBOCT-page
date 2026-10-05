/// <reference types="vite/client" />

interface FileSystemHandlePermissionDescriptor {
	mode?: "read" | "readwrite";
}

interface FileSystemHandle {
	queryPermission(
		descriptor?: FileSystemHandlePermissionDescriptor,
	): Promise<PermissionState>;
	requestPermission(
		descriptor?: FileSystemHandlePermissionDescriptor,
	): Promise<PermissionState>;
}

interface SaveFilePickerOptions {
	suggestedName?: string;
	types?: { description?: string; accept: Record<string, string[]> }[];
}

interface DirectoryPickerOptions {
	id?: string;
	mode?: "read" | "readwrite";
}

interface Window {
	showSaveFilePicker(
		options?: SaveFilePickerOptions,
	): Promise<FileSystemFileHandle>;
	showDirectoryPicker(
		options?: DirectoryPickerOptions,
	): Promise<FileSystemDirectoryHandle>;
}

declare module "*.svg" {
	const content: string;
	export default content;
}

declare module "*.png" {
	const content: string;
	export default content;
}

declare module "*.jpg" {
	const content: string;
	export default content;
}

declare module "*.jpeg" {
	const content: string;
	export default content;
}

declare module "*.gif" {
	const content: string;
	export default content;
}
