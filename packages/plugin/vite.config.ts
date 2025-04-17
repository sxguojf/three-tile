// import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			rollupTypes: true,
		}),
	],
	build: {
		target: "ES2020",
		outDir: "./dist",
		lib: {
			entry: "./src/index.ts",
			name: "ThreeTilePlugin",
			fileName: "three-tile-plugin",
		},
		rollupOptions: {
			external: ["three", "three-tile"],
			output: {
				inlineDynamicImports: true, // 将动态导入的内容内联
				globals: {
					three: "THREE",
					"three-tile": "ThreeTile",
				},
			},
		},
		// sourcemap: true,
	},
	// resolve: {
	// 	alias: {
	// 		"three-tile": resolve(__dirname, "../lib/src"),
	// 	},
	// },
});
