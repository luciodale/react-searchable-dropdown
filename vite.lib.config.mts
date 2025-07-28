import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    dts({
      outDir: "packages/library/dist",
      include: ["packages/library/src/**/*"],
      exclude: [
        "packages/library/src/**/*.test.ts",
        "packages/library/src/**/*.test.tsx",
      ],
      tsconfigPath: "packages/library/tsconfig.json",
    }),
    viteStaticCopy({
      targets: [
        {
          src: "packages/library/src/assets/multi-style.css",
          dest: "assets",
        },
        {
          src: "packages/library/src/assets/single-style.css",
          dest: "assets",
        },
        {
          src: "packages/library/src/assets/variables.css",
          dest: "assets",
        },
        {
          src: "./README.md",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    outDir: "packages/library/dist",
    emptyOutDir: true,
    lib: {
      name: "LucioDaleReactSearchableDropdown",
      entry: resolve(__dirname, "packages/library/src/index.ts"),

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
  // to build with other react versions and test for compatibility
  // resolve: {
  //   alias: {
  //     react: '/Users/lda/Desktop/test-react18-dropdown/node_modules/react',
  //     "react-dom": '/Users/lda/Desktop/test-react18-dropdown/node_modules/react-dom',
  //   },
  // },
});