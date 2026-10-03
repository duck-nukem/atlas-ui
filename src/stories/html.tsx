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
