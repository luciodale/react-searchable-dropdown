import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import {viteStaticCopy} from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [react(), dts(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/variables.css',
          dest: 'assets'
        },
        {
          src: 'src/assets/single-style.css',
          dest: 'assets'
        },
        {
          src: 'src/assets/multi-style.css',
          dest: 'assets'
        }
      ]
    })
  ],
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
			},
		},
	},
});
