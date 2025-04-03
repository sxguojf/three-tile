import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	build: {
		rollupOptions: {
			input: {
				main: "index.html",
			},
		},
	},
	resolve: {
		alias: {
			"three-tile": path.resolve(__dirname, "../lib/src"),
			"three-tile-plugin": path.resolve(__dirname, "../plugin/src"),
		},
	},

	server: {
		port: 8001,
	},
});
