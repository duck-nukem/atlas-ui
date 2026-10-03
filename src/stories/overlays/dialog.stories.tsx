import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, icon, mobile } from "../html";

const modal = `
<button class="ui-button" type="button" commandfor="new-goal" command="show-modal">New goal</button>
<dialog class="ui-dialog" id="new-goal" aria-labelledby="new-goal-title" closedby="any">
  <form method="post" action="#goals">
    <header class="ui-dialog-header">
      <h2 id="new-goal-title">New goal</h2>
      <button class="ui-button" data-variant="ghost" data-shape="icon" data-size="sm" type="button" commandfor="new-goal" command="close" aria-label="Close">${icon("x")}</button>
    </header>
    <div class="ui-dialog-body ui-stack">
      <div class="ui-field">
        <label class="ui-label" for="goal-title">Title</label>
        <input class="ui-input" id="goal-title" name="title" required autofocus>
      </div>
      <div class="ui-field">
        <label class="ui-label" for="goal-date">Target date</label>
        <input class="ui-input" id="goal-date" name="target" type="date">
      </div>
    </div>
    <footer class="ui-dialog-footer">
      <button class="ui-button" data-variant="outline" type="button" commandfor="new-goal" command="close">Cancel</button>
      <button class="ui-button" type="submit">Create goal</button>
    </footer>
  </form>
</dialog>`;

const confirm = `
<button class="ui-button" data-variant="danger" type="button" commandfor="leave" command="show-modal">Leave organisation</button>
<dialog class="ui-dialog" id="leave" role="alertdialog" aria-labelledby="leave-title" aria-describedby="leave-text">
  <form method="post" action="#leave">
    <header class="ui-dialog-header"><h2 id="leave-title">Leave Acme?</h2></header>
    <div class="ui-dialog-body"><p id="leave-text">You lose access to its tasks and chat until someone invites you again.</p></div>
    <footer class="ui-dialog-footer">
      <button class="ui-button" data-variant="outline" type="button" commandfor="leave" command="close" autofocus>Stay</button>
      <button class="ui-button" data-variant="danger" type="submit">Leave</button>
    </footer>
  </form>
</dialog>`;

const opened = (markup: string, button: string): StoryObj => ({
  ...html(markup),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: button }));

    await expect(
      canvas.getByRole(
        markup.includes("alertdialog") ? "alertdialog" : "dialog",
      ),
    ).toBeVisible();
  },
});

export default {
  title: "Overlays/Dialog",
  parameters: {
    docs: {
      description: {
        component:
          "A native dialog opened with commandfor and command, so no script is needed. closedby=any closes it on a backdrop click",
      },
    },
  },
} satisfies Meta;

export const Modal = opened(modal, "New goal");

export const Confirm = opened(confirm, "Leave organisation");

export const Mobile: StoryObj = {
  ...opened(modal, "New goal"),
  ...mobile(modal),
};
