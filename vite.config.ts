import { defineConfig } from "vite";

export default defineConfig({
  root: "src",

  build: {
    outDir: "../resources",
    emptyOutDir: false,
  },

  server: {
    port: 5173,
  },
});