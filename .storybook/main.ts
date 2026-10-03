import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  staticDirs: [{ from: "../src/icons", to: "/" }],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/react-vite",
  viteFinal: (vite) => ({
    ...vite,
    plugins: [...(vite.plugins ?? []), tailwindcss()],
  }),
};

export default config;
