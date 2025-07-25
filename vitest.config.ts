import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["packages/library/src/**/*.test.ts"],
		environment: "jsdom",
		coverage: {
			provider: "v8",
			exclude: ["node_modules/", "dist/", "**/*.d.ts", "**/*.config.*", "**/coverage/**"],
		},
	},
	resolve: {
		alias: {
			"react-searchable-dropdown": "packages/library/src",
		},
	},
});
