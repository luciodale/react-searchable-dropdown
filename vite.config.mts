import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [react(), dts()],
	build: {
		lib: {
			name: "LucioDaleReactSearchableDropdown",
			entry: resolve(__dirname, "src/index.ts"),
			formats: ["es", "umd"],
			fileName: (format) => `react-searchable-dropdown.${format}.js`,
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
				assetFileNames: (assetInfo) => {
					console.log("LUCIO", assetInfo.originalFileNames[0]);
					if (assetInfo.originalFileNames[0] === "style.css") return "style.css";
					return assetInfo.originalFileNames[0];
				},
			},
		},
	},
});
