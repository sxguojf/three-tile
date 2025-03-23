import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
// import wasm from "vite-plugin-wasm";

export default defineConfig({
	plugins: [
		// wasm(),
		dts({
			outDir: ["dist"],
			rollupTypes: true,
		}),
	],
	build: {
		target: "esnext",
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
			},
		},
		// sourcemap: true,
	},
});
