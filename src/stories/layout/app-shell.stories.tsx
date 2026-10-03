import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, mobile } from "../html";
import { shell } from "./shell";

const page = shell(
  `<div class="ui-page"><h1 class="ui-page-title" style="margin:0">Home</h1><p>Page content</p></div>`,
);

export default {
  title: "Layout/App shell",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export const Desktop = html(page);

export const Mobile = mobile(page);

export const MobileMenuOpen: StoryObj = {
  ...mobile(page),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open menu" }));

    await expect(canvas.getByRole("dialog", { name: "Menu" })).toBeVisible();
  },
};
