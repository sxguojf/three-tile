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
