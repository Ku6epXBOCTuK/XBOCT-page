import type { Bookmark } from "$lib/state/bookmarks.svelte";
import { getDomain } from "$lib/url";

interface PageInfo {
	title?: string;
	favicon?: string;
}

interface ParsedGroup {
	name: string;
	bookmarks: [string, string][];
}

export async function fetchPageInfo(url: string): Promise<PageInfo> {
	const domain = getDomain(url);

	try {
		const response = await chrome.runtime.sendMessage({
			action: "fetchPageInfo",
			url,
		});

		if (response && !response.error) {
			return {
				title: response.title || domain,
				favicon: "",
			};
		}
		return { title: domain, favicon: "" };
	} catch {
		return { title: domain, favicon: "" };
	}
}

export function createBookmark(url: string, title?: string): Bookmark {
	return {
		id: crypto.randomUUID(),
		title: title || "",
		url,
		favicon: "",
	};
}

export async function parseNetscapeHtml(file: File): Promise<ParsedGroup[]> {
	const text = await file.text();
	const groups: ParsedGroup[] = [];

	const lines = text.split("\n");
	let currentGroup: ParsedGroup | null = null;

	for (const line of lines) {
		const trimmed = line.trim();

		if (trimmed.startsWith("<DT><H3") && !trimmed.includes('PAGE="true"')) {
			const nameMatch = trimmed.match(/<DT><H3[^>]*>([^<]+)<\/H3>/i);
			if (nameMatch) {
				const name = nameMatch[1].trim();
				if (name) {
					currentGroup = { name, bookmarks: [] };
					groups.push(currentGroup);
				}
			}
		}

		if (trimmed.startsWith("<DT><A")) {
			const match = trimmed.match(
				/<DT><A[^>]*HREF="([^"]*)"[^>]*>([^<]*)<\/A>/i,
			);
			if (match && currentGroup) {
				const url = match[1];
				const title = match[2].trim();
				if (url && title) {
					currentGroup.bookmarks.push([url, title]);
				}
			}
		}
	}

	console.log("[parseNetscapeHtml] Parsed", groups.length, "groups");
	return groups;
}
