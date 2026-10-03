import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/css/fonts.css";
import "../src/css/index.css";
import { installInterest } from "../src/interest";

installInterest(navigator.webdriver);

document.addEventListener(
  "click",
  (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest("a[href]") !== null
    ) {
      event.preventDefault();
    }
  },
  true,
);
document.addEventListener("submit", (event) => event.preventDefault(), true);

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals["theme"];
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", dark);

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
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { codePanel: true, canvas: { sourceState: "shown" } },
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
