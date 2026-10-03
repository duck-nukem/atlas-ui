import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: "chromium" as const }, { browser: "webkit" as const }],
});

const unit = () => ({
  globals: true,
  include: ["src/elements/**/*.test.ts"],
  browser: browser(),
  setupFiles: ["src/test/setup.ts"],
  passWithNoTests: true,
  fileParallelism: false,
});

export default defineConfig({
  test: {
    projects: [
      { test: { ...unit(), name: "elements" } },
      ...["light", "dark"].map((theme) => ({
        plugins: [storybookTest({ configDir: ".storybook" })],
        define: { "import.meta.env.VITE_UI_THEME": JSON.stringify(theme) },
        test: { name: `storybook-${theme}`, browser: browser() },
      })),
    ],
  },
});
