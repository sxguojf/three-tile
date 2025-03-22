import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	build: {
		rollupOptions: {
			input: {
				main: "src/index.html",
			},
		},
	},

	server: {
		port: 8001,
	},
});
