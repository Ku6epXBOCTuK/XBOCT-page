import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DIST = path.resolve("dist");
const OUT_DIR = path.resolve("docs");
const VIEWPORT = { width: 1600, height: 900 };
// chrome:// URLs are blocked in headless, and we need chrome://extensions for the ID
const HEADLESS = false;

const DEMO_DATA = {
	version: 1,
	groups: [
		{
			column: 0,
			name: "Development",
			icon: "code",
			bookmarks: [
				["https://github.com", "GitHub"],
				["https://stackoverflow.com", "Stack Overflow"],
				["https://developer.mozilla.org", "MDN Web Docs"],
				["https://svelte.dev", "Svelte"],
			],
		},
		{
			column: 0,
			name: "Design",
			icon: "palette",
			bookmarks: [
				["https://figma.com", "Figma"],
				["https://dribbble.com", "Dribbble"],
				["https://behance.net", "Behance"],
			],
		},
		{
			column: 1,
			name: "Media",
			icon: "music",
			bookmarks: [
				["https://music.youtube.com", "YouTube Music"],
				["https://spotify.com", "Spotify"],
				["https://soundcloud.com", "SoundCloud"],
			],
		},
		{
			column: 1,
			name: "Reading",
			icon: "book-open",
			bookmarks: [
				["https://habr.com", "Habr"],
				["https://medium.com", "Medium"],
				["https://dev.to", "DEV Community"],
			],
		},
		{
			column: 2,
			name: "Work",
			icon: "briefcase",
			bookmarks: [
				["https://gmail.com", "Gmail"],
				["https://calendar.google.com", "Google Calendar"],
				["https://notion.so", "Notion"],
				["https://slack.com", "Slack"],
			],
		},
		{
			column: 3,
			name: "Entertainment",
			icon: "gamepad-2",
			bookmarks: [
				["https://twitch.tv", "Twitch"],
				["https://youtube.com", "YouTube"],
				["https://store.steampowered.com", "Steam"],
			],
		},
	],
};

async function main() {
	if (!fs.existsSync(path.join(DIST, "manifest.json"))) {
		console.error("dist/ not found. Run `pnpm run build` first.");
		process.exit(1);
	}

	const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "xboct-shots-"));

	const context = await chromium.launchPersistentContext(userDataDir, {
		headless: HEADLESS,
		viewport: VIEWPORT,
		// Playwright passes --disable-extensions by default, which wins over --load-extension
		ignoreDefaultArgs: ["--disable-extensions"],
		args: [`--disable-extensions-except=${DIST}`, `--load-extension=${DIST}`],
	});

	try {
		const extensionsPage = await context.newPage();
		await extensionsPage.goto("chrome://extensions");
		await extensionsPage.locator("#devMode").click();
		const extensionId = await extensionsPage
			.locator("extensions-item")
			.first()
			.getAttribute("id");
		if (!extensionId) throw new Error("Extension not found");
		await extensionsPage.close();

		const startUrl = `chrome-extension://${extensionId}/src/start/index.html`;

		const page = await context.newPage();
		await page.goto(startUrl);

		await page.evaluate(async (data) => {
			await chrome.storage.sync.set({ bookmarks: data });
		}, DEMO_DATA);
		await page.reload({ waitUntil: "networkidle" });
		await page.waitForTimeout(1500);

		await page.screenshot({ path: path.join(OUT_DIR, "screenshot-dark.png") });
		console.log("saved docs/screenshot-dark.png");

		await page.getByTitle("Переключить тему").click();
		await page.waitForTimeout(500);
		await page.screenshot({
			path: path.join(OUT_DIR, "screenshot-light.png"),
		});
		console.log("saved docs/screenshot-light.png");
	} finally {
		await context.close();
		fs.rmSync(userDataDir, { recursive: true, force: true });
	}
}

main();
