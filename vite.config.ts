import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: { index: "src/react/index.ts", interest: "src/interest.ts" },
      formats: ["es"],
    },
    rolldownOptions: { external: [/^react/, /^preact/] },
    emptyOutDir: false,
  },
});
