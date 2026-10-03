import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, icon, mobile } from "../html";

const menu = `
<button class="ui-button" data-variant="ghost" data-shape="icon" type="button" popovertarget="task-actions" aria-label="Task actions">${icon("ellipsis")}</button>
<div class="ui-popover ui-menu" id="task-actions" popover>
  <ul>
    <li><a class="ui-menu-item" href="#edit">${icon("pencil")} Edit</a></li>
    <li><a class="ui-menu-item" href="#link">${icon("link-2")} Copy link</a></li>
    <li><form method="post" action="#archive"><button class="ui-menu-item" type="submit">${icon("folder")} Archive</button></form></li>
  </ul>
  <hr>
  <ul>
    <li><button class="ui-menu-item" data-variant="danger" type="button" commandfor="delete-task" command="show-modal">${icon("trash-2")} Delete</button></li>
  </ul>
</div>
<dialog class="ui-dialog" id="delete-task" role="alertdialog" aria-labelledby="delete-task-title">
  <form method="post" action="#delete">
    <header class="ui-dialog-header"><h2 id="delete-task-title">Delete T-128?</h2></header>
    <footer class="ui-dialog-footer">
      <button class="ui-button" data-variant="outline" type="button" commandfor="delete-task" command="close" autofocus>Cancel</button>
      <button class="ui-button" data-variant="danger" type="submit">Delete</button>
    </footer>
  </form>
</dialog>`;

const open: StoryObj["play"] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Task actions" }));

  await expect(canvas.getByRole("link", { name: "Edit" })).toBeVisible();
};

export default {
  title: "Overlays/Menu",
  parameters: {
    docs: {
      description: {
        component:
          "A popover list of links and form buttons. It uses no menu role, so Tab moves through the items and Escape closes it",
      },
    },
  },
} satisfies Meta;

export const Closed = html(menu);

export const Open: StoryObj = { ...html(menu), play: open };

export const InRow = html(`
<div class="ui-row" style="justify-content:space-between;max-inline-size:28rem">
  <span>T-128 Export flow metrics as CSV</span>
  ${menu}
</div>`);

export const Mobile: StoryObj = { ...mobile(menu), play: open };
