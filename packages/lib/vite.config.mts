import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			outDir: ["./dist"],
			rollupTypes: true,
		}),
	],
	build: {
		target: "es2015",
		outDir: "./dist",
		lib: {
			entry: "./src/index.ts",
			name: "ThreeTile",
		},
		rollupOptions: {
			external: ["three"],
			output: {
				globals: {
					three: "THREE",
				},
			},
		},
		// sourcemap: true,
	},
});
