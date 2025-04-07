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
		},
	},
	server: {
		port: 8001,		
	},	
});
