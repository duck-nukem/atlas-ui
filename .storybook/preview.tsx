import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/css/fonts.css";
import "../src/css/index.css";

const withTheme: Decorator = (Story, context) => {
  document.documentElement.classList.toggle(
    "dark",
    context.globals["theme"] === "dark",
  );
  document.documentElement.classList.toggle(
    "light",
    context.globals["theme"] === "light",
  );

  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Colour scheme",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "system", title: "System" },
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: import.meta.env["VITE_UI_THEME"] ?? "system" },
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    viewport: {
      options: {
        mobile: {
          name: "Mobile 375",
          styles: { width: "375px", height: "740px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet 640",
          styles: { width: "640px", height: "900px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop 1280",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
      },
    },
  },
};

export default preview;
