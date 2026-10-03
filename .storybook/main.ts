import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.ts"],
  staticDirs: [{ from: "../src/icons", to: "/" }],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/html-vite",
  viteFinal: (vite) => ({
    ...vite,
    plugins: [...(vite.plugins ?? []), tailwindcss()],
  }),
};

export default config;
