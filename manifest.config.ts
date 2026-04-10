import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
	manifest_version: 3,
	name: "XBOCT-page",
	version: pkg.version,
	icons: {
		48: "public/logo.png",
	},
	action: {
		default_icon: {
			48: "public/logo.png",
		},
		default_popup: "src/popup/index.html",
	},
	chrome_url_overrides: {
		newtab: "src/start/index.html",
	},
	permissions: ["storage"],
});
