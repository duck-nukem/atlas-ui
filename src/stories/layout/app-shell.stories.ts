import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, select, type Story } from "../html";
import { shell, type ShellArgs } from "./shell";

const pages = [
  "My desk",
  "Goals",
  "Features",
  "Flow",
  "Housekeeping",
  "Chat",
  "Tasks",
  "Repositories",
  "Releases",
  "Health",
  "Applications",
  "Organization",
] as const;

export default {
  title: "Layout/App shell",
  ...html<ShellArgs>(
    (args) =>
      shell(
        args,
        `<div class="ui-page"><div class="ui-page-header"><div class="ui-page-title"><h1>${args.current}</h1></div></div></div>`,
      ),
    { layout: "fullscreen" },
  ),
  args: {
    organization: "Test org",
    current: "Tasks",
    unread: 0,
    mentioned: false,
    application: "All applications",
  },
  argTypes: {
    current: select(pages),
    application: select(["All applications", "Webapp", "Back office"]),
  },
} satisfies Meta<ShellArgs>;

export const Default: Story<ShellArgs> = {};

export const Unread: Story<ShellArgs> = {
  args: { unread: 3, mentioned: true },
};

export const AccountMenu: Story<ShellArgs> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Account menu" }));

    await expect(canvas.getByRole("link", { name: "Account" })).toBeVisible();
  },
};

export const Navigation: Story<ShellArgs> = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Open navigation" }),
    );

    await expect(
      canvas.getByRole("dialog", { name: "Test org" }),
    ).toBeVisible();
  },
};
