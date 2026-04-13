import type { Bookmark } from "$lib/state/bookmarks.svelte";
import { getDomain } from "$lib/url";

interface PageInfo {
	title?: string;
	favicon?: string;
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
