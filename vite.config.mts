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
	server: {
		port: 8001,
	},
});
