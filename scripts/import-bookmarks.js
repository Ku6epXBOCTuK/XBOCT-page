import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(
	__dirname,
	"Export-2026-4-12-e1e6c7355e4420bd.html",
);
const OUTPUT_FILE = path.join(__dirname, "bookmarks.json");

const html = fs.readFileSync(INPUT_FILE, "utf8");

const groupStack = [];

const lines = html.split("\n");

let columnsCount = null;

for (const line of lines) {
	const trimmed = line.trim();

	if (trimmed.startsWith("<DT><H3") && trimmed.includes('PAGE="true"')) {
		const colsMatch = trimmed.match(/COLUMNS="(\d+)"/i);
		if (colsMatch) {
			columnsCount = parseInt(colsMatch[1], 10);
		}
	}

	if (trimmed.startsWith("<DT><H3") && !trimmed.includes('PAGE="true"')) {
		const nameMatch = trimmed.match(/<DT><H3[^>]*>([^<]+)<\/H3>/i);
		if (nameMatch) {
			const name = nameMatch[1].trim();
			if (name && !trimmed.includes('PAGE="true"')) {
				groupStack.push({ name, bookmarks: [] });
			}
		}
	}

	if (trimmed.startsWith("<DT><A")) {
		const match = trimmed.match(/<DT><A[^>]*HREF="([^"]*)"[^>]*>([^<]*)<\/A>/i);
		if (match && groupStack.length > 0) {
			const url = match[1];
			const title = match[2].trim();
			if (url && title) {
				groupStack[groupStack.length - 1].bookmarks.push([url, title]);
			}
		}
	}
}

const colsForDistribution = columnsCount ?? 4;
const groupsPerColumn = Math.ceil(groupStack.length / colsForDistribution);
const result = {
	version: 1,
	groups: groupStack.map((g, idx) => ({
		column: Math.floor(idx / groupsPerColumn),
		name: g.name,
		bookmarks: g.bookmarks,
	})),
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
console.log("Created bookmarks.json with", groupStack.length, "groups");
groupStack.forEach((g, i) =>
	console.log(`  ${i}: ${g.name} - ${g.bookmarks.length} bookmarks`),
);
