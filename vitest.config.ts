import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
		environment: "jsdom",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "lcov"],
			exclude: ["node_modules/", "dist/", "**/*.d.ts", "**/*.config.*", "**/coverage/**"],
		},
	},
});
