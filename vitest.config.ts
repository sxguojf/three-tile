import { defineConfig } from "vitest/config";

export default defineConfig({
	base: "./",
	root: "src",
	test: {
		environment: "jsdom",
	},
});
