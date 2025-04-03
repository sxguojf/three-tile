import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
	plugins: [
		dts({
			outDir: ["dist"],
			rollupTypes: true,
		}),
	],
	build: {
		target: "esnext",
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "ThreeTilePlugin", //打包后全局变量名，umd中使用
			fileName: "three-tile-plugin",
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
	resolve: {
		alias: {
			"three-tile": path.resolve(__dirname, "../lib/src"),
		},
	},
});
