import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	build: {
		rollupOptions: {
			input: {
				main: "./src/index.html",
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "../lib/src")
		}
	},
	server: {
		port: 8001,
	},
});
	
