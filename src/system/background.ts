chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request.action === "fetchPageInfo") {
		console.log("[background] fetchPageInfo received:", request.url);

		getPageInfo(request.url)
			.then((result) => {
				console.log("[background] Result:", result);
				sendResponse(result);
			})
			.catch((error) => {
				console.error("[background] Error:", error);
				sendResponse({ error: error.message });
			});

		return true;
	}
});

async function getPageInfo(
	url: string,
): Promise<{ title: string; favicon: string }> {
	try {
		const urlObj = new URL(url);
		const domain = urlObj.hostname;

		console.log("[background] Domain:", domain);

		const extensionId = chrome.runtime.id;
		console.log("[background] Extension ID:", extensionId);

		const favicon = `chrome-extension://${extensionId}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`;
		console.log("[background] Favicon URL:", favicon);

		let title = domain;

		const response = await fetch(url, {
			redirect: "follow",
		});

		console.log("[background] Response status:", response.status);
		console.log("[background] Final URL:", response.url);

		if (response.ok) {
			const html = await response.text();

			const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
			if (titleMatch) {
				title = titleMatch[1].trim();
				console.log("[background] Title found:", title);
			}
		}

		return { title, favicon };
	} catch (e) {
		console.error("[background] getPageInfo error:", e);
		return { title: "error", favicon: "" };
	}
}
