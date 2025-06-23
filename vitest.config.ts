import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
		environment: "jsdom",
		coverage: {
			provider: "v8",
			exclude: ["node_modules/", "dist/", "**/*.d.ts", "**/*.config.*", "**/coverage/**"],
		},
	},
});
