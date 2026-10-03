import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, icon, type Story } from "../html";

type Args = {
  title: string;
  body: string;
  cancel: string;
  confirm: string;
  destructive: boolean;
};

export default {
  title: "Overlays/Dialog",
  ...html<Args>(
    ({
      title,
      body,
      cancel,
      confirm,
      destructive,
    }) => `<button class="ui-button" data-variant="outline" type="button" commandfor="dialog" command="show-modal">${title}</button>
<dialog class="ui-dialog" id="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-body" closedby="any">
  <div class="ui-dialog-header">
    <h2 id="dialog-title">${title}</h2>
    <p id="dialog-body">${body}</p>
  </div>
  <div class="ui-dialog-footer">
    <button class="ui-button" data-variant="outline" type="button" commandfor="dialog" command="close">${cancel}</button>
    <form method="post" action="#confirm"><button class="ui-button"${destructive ? ' data-variant="destructive"' : ""} type="submit">${confirm}</button></form>
  </div>
  <button class="ui-button ui-dialog-close" data-variant="ghost" data-size="icon-sm" type="button" commandfor="dialog" command="close" aria-label="Close">${icon("x")}</button>
</dialog>`,
  ),
  args: {
    title: "Remove Ada Lovelace?",
    body: "Ada Lovelace loses access to this organization right away. Their comments and commits stay, shown as a deleted user.",
    cancel: "Cancel",
    confirm: "Remove",
    destructive: true,
  },
} satisfies Meta<Args>;

export const Open: Story<Args> = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: args.title }));

    await expect(
      canvas.getByRole("dialog", { name: args.title }),
    ).toBeVisible();
  },
};
