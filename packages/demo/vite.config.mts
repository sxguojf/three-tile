import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: "./index.html",
			},
		},
	},
	server: {
		port: 8001,
	},
	optimizeDeps: {
		include: ["three-tile"],
	},
});
