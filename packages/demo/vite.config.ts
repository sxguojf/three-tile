import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	plugins: [],
	build: {
		target: "esnext",
		outDir: "./dist",
		// 开启 sourcemap
		sourcemap: true,
		rollupOptions: {
			output: {
				// 为每个输出格式生成 sourcemap
				sourcemapExcludeSources: false,
			},
		},
	},
	resolve: {
		alias: {
			"three-tile-lib": path.resolve(__dirname, "../lib/src"),
			"three-tile-plugin": path.resolve(__dirname, "../plugin/src"),
		},
	},
});
