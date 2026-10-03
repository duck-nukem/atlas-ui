import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: { elements: "src/elements/index.ts", interest: "src/interest.ts" },
      formats: ["es"],
    },
    emptyOutDir: false,
  },
});
