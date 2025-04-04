import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
	plugins: [
		dts({
			rollupTypes: true,
		}),
	],
	build: {
		target: "esnext",
		outDir: "./dist",
		sourcemap: true,
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "ThreeTile", //打包后全局变量名，umd中使用
			fileName: "three-tile",
		},
		rollupOptions: {
			external: ["three"],
			output: {
				globals: {
					three: "THREE",
				},
				sourcemapExcludeSources: false,
			},
		},
		// watch: {
		// 	include: "src/**",
		// 	clearScreen: false,
		// },
	},
});
