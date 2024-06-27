import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import copy from "rollup-plugin-copy";
import path from "path";

export default defineConfig({
	plugins: [
		dts({
			outDir: ["dist"],
			rollupTypes: true,
		}),
		copy({
			verbose: true,
			hook: "closeBundle",
			targets: [{ src: "src/plugin/lercLoader/lercDecode/lerc-wasm.wasm", dest: "dist" }],
		}),
	],
	build: {
		target: "esnext",
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "tt",
			fileName: "three-tile",
		},
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		rollupOptions: {
			external: ["three"],
			output: {
				globals: {
					three: "THREE",
				},
			},
		},
	},
});
