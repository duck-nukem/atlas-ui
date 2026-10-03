import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, icon, type Story } from "../html";

type MenuArgs = {
  name: string;
  items: string;
  destructive: string;
  align: "start" | "end";
};

const menu = ({
  name,
  items,
  destructive,
  align,
}: MenuArgs) => `<div style="display:flex;justify-content:${align === "end" ? "flex-end" : "flex-start"}">
  <button class="ui-button" data-variant="ghost" data-size="icon-sm" type="button" popovertarget="actions" aria-label="Actions for ${name}">${icon("ellipsis")}</button>
  <div class="ui-menu"${align === "end" ? ' data-align="end"' : ""} id="actions" popover>
    ${items
      .split(",")
      .map(
        (item, index) =>
          `<a class="ui-menu-item" href="#${index}"${index === 0 ? " autofocus" : ""}>${item.trim()}</a>`,
      )
      .join("\n    ")}${
      destructive === ""
        ? ""
        : `
    <hr class="ui-menu-separator">
    <button class="ui-menu-item" data-variant="destructive" type="button" commandfor="confirm" command="show-modal">${destructive}</button>`
    }
  </div>
</div>${
  destructive === ""
    ? ""
    : `
<dialog class="ui-dialog" id="confirm" aria-labelledby="confirm-title" aria-describedby="confirm-body" closedby="any">
  <div class="ui-dialog-header">
    <h2 id="confirm-title">Remove ${name}?</h2>
    <p id="confirm-body">${name} loses access to this organization right away. Their comments and commits stay, shown as a deleted user.</p>
  </div>
  <div class="ui-dialog-footer">
    <button class="ui-button" data-variant="outline" type="button" commandfor="confirm" command="close">Cancel</button>
    <form method="post" action="#remove"><button class="ui-button" data-variant="destructive" type="submit">Remove</button></form>
  </div>
  <button class="ui-button ui-dialog-close" data-variant="ghost" data-size="icon-sm" type="button" commandfor="confirm" command="close" aria-label="Close">${icon("x")}</button>
</dialog>`
}`;

export default {
  title: "Overlays/Menu",
  ...html(menu),
  args: {
    name: "Ada Lovelace",
    items: "View profile, Make admin",
    destructive: "Remove from organization",
    align: "end",
  },
  argTypes: { align: { control: "inline-radio", options: ["start", "end"] } },
} satisfies Meta<MenuArgs>;

export const Closed: Story<MenuArgs> = {};

export const Open: Story<MenuArgs> = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: `Actions for ${args.name}` }),
    );

    await expect(
      canvas.getByRole("link", { name: "View profile" }),
    ).toBeVisible();
  },
};
