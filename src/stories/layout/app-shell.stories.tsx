import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, mobile } from "../html";
import { shell } from "./shell";

const page = shell(`
<div class="ui-page">
  <div class="ui-page-header" style="position:static">
    <div class="ui-page-title"><div class="ui-page-title-row"><h1>Tasks</h1><div class="ui-page-actions"><a class="ui-button" href="#new">New task</a></div></div></div>
  </div>
</div>`);

export default {
  title: "Layout/App shell",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export const Desktop = html(page);

export const AccountMenu: StoryObj = {
  ...html(page),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Account menu" }));

    await expect(canvas.getByRole("link", { name: "Account" })).toBeVisible();
  },
};

export const Mobile = mobile(page);

export const MobileNavigation: StoryObj = {
  ...mobile(page),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Open navigation" }),
    );

    await expect(
      canvas.getByRole("dialog", { name: "Test org" }),
    ).toBeVisible();
  },
};
