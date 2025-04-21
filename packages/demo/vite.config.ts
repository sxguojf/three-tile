import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	base: "./",
	build: {
		rollupOptions: {
			input: {
				main: "./index.html",
			},
		},
	},
	resolve: {
		alias: {
			"three-tile": resolve(__dirname, "../lib/src"),
			"three-tile-plugin": resolve(__dirname, "../plugin/src"),
		},
	},
	server: {
		port: 8001,
	},
});
