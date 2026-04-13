import { crx } from "@crxjs/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "node:path";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";
import manifest from "./manifest.config";
import { name, version } from "./package.json";

export default defineConfig({
	resolve: {
		alias: {
			"@": `${path.resolve(__dirname, "src")}`,
			$cmp: `${path.resolve(__dirname, "src/components")}`,
			$lib: `${path.resolve(__dirname, "src/lib")}`,
		},
	},
	plugins: [
		svelte(),
		Icons({
			compiler: "svelte",
		}),
		crx({ manifest }),
		zip({ outDir: "release", outFileName: `crx-${name}-${version}.zip` }),
	],
});
