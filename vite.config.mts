import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	build: {
		rollupOptions: {
			input: {
				main: "packages/demo/index.html",
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "packages/lib/src"),
		},
	},
	server: {
		port: 8001,
	},
});
