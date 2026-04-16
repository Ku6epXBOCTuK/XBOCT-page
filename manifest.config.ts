import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
	manifest_version: 3,
	name: "XBOCT-page",
	version: pkg.version,
	icons: {
		16: "public/logo-16.png",
		32: "public/logo-32.png",
		48: "public/logo-48.png",
		128: "public/logo-128.png",
		256: "public/logo-512.png",
		512: "public/logo-512.png",
	},
	action: {
		default_icon: {
			48: "public/logo-48.png",
		},
		default_popup: "src/popup/index.html",
	},
	chrome_url_overrides: {
		newtab: "src/start/index.html",
	},
	permissions: ["storage", "favicon"],
	host_permissions: ["<all_urls>"],
	background: {
		service_worker: "src/system/background.ts",
	},
	web_accessible_resources: [
		{
			resources: ["_favicon/*"],
			matches: ["<all_urls>"],
			extension_ids: [],
			use_dynamic_url: true,
		},
	],
});
