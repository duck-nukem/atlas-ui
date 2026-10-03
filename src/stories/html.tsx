import type { StoryObj } from "@storybook/react-vite";

export const html = (markup: string): StoryObj => ({
  render: () => (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  ),
  parameters: { docs: { source: { code: markup.trim(), language: "html" } } },
});

export const mobile = (markup: string): StoryObj => ({
  ...html(markup),
  globals: { viewport: { value: "mobile", isRotated: false } },
});

export const icon = (name: string, size?: "sm" | "lg") =>
  `<svg class="ui-icon"${size ? ` data-size="${size}"` : ""} aria-hidden="true"><use href="icons.svg#${name}"/></svg>`;
