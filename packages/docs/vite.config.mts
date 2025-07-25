import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist",
		emptyOutDir: true,
	},
	server: {
		port: 3000,
		open: true,
	},
	resolve: {
		alias: {
			"react-searchable-dropdown": resolve(__dirname, "../library/src"),
		},
	},
});
