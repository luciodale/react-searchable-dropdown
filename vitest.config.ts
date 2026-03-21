import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		include: ["packages/library/src/**/*.test.{ts,tsx}"],
		environment: "jsdom",
		setupFiles: ["packages/library/src/test-setup.ts"],
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
