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
		},
	},

	server: {
		port: 8001,
	},
});
