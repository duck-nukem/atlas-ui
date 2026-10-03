import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: "src/react/index.ts", formats: ["es"], fileName: "index" },
    rolldownOptions: { external: [/^react/, /^preact/] },
    emptyOutDir: false,
  },
});
