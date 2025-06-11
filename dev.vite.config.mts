import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	root: "dev",
	build: {
		outDir: "../docs",
	},
	server: {
		port: 3000,
		open: true,
	},
	resolve: {
		alias: {
			"react-searchable-dropdown": resolve(__dirname, "src"),
		},
	},
});
