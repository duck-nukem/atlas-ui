import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const unit = {
  globals: true,
  environment: "jsdom",
  include: ["src/react/**/*.test.tsx"],
  setupFiles: ["src/test/setup.ts"],
  passWithNoTests: true,
};

const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: "chromium" as const }],
});

export default defineConfig({
  test: {
    projects: [
      { plugins: [react()], test: { ...unit, name: "react" } },
      {
        resolve: {
          alias: [
            {
              find: /^react-dom\/test-utils$/,
              replacement: "preact/test-utils",
            },
            { find: /^react-dom(\/client)?$/, replacement: "preact/compat" },
            {
              find: /^react\/jsx-(dev-)?runtime$/,
              replacement: "preact/jsx-runtime",
            },
            { find: /^react$/, replacement: "preact/compat" },
            {
              find: /^@testing-library\/react$/,
              replacement: "@testing-library/preact",
            },
          ],
        },
        oxc: { jsx: { runtime: "automatic", importSource: "preact" } },
        test: { ...unit, name: "preact" },
      },
      ...["light", "dark"].map((theme) => ({
        plugins: [storybookTest({ configDir: ".storybook" })],
        define: { "import.meta.env.VITE_UI_THEME": JSON.stringify(theme) },
        test: { name: `storybook-${theme}`, browser: browser() },
      })),
    ],
  },
});
