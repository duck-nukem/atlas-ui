import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const confirm = (id: string, label: string) => `
<button class="ui-button" data-variant="danger-ghost" data-size="sm" type="button" popovertarget="${id}">${icon("trash-2")} ${label}</button>
<form class="ui-popover" id="${id}" popover method="post" action="#delete">
  <p style="margin-block-start:0">Delete this task? This cannot be undone.</p>
  <div class="ui-form-actions">
    <button class="ui-button" data-variant="ghost" data-size="sm" type="button" popovertarget="${id}" popovertargetaction="hide">Cancel</button>
    <button class="ui-button" data-variant="danger" data-size="sm" type="submit">Delete task</button>
  </div>
</form>`;

export default {
  title: "Primitives/Delete button",
  parameters: {
    docs: {
      description: {
        component:
          "A delete asks for confirmation in a popover next to the button and posts a plain form",
      },
    },
  },
} satisfies Meta;

export const Default = html(confirm("delete-default", "Delete"));

export const IconOnly = html(`
<button class="ui-button" data-variant="danger-ghost" data-shape="icon" data-size="sm" type="button" popovertarget="delete-icon" aria-label="Delete comment">${icon("trash-2")}</button>
<form class="ui-popover" id="delete-icon" popover method="post" action="#delete">
  <div class="ui-form-actions">
    <button class="ui-button" data-variant="ghost" data-size="sm" type="button" popovertarget="delete-icon" popovertargetaction="hide">Cancel</button>
    <button class="ui-button" data-variant="danger" data-size="sm" type="submit">Delete comment</button>
  </div>
</form>`);

export const Mobile = mobile(confirm("delete-mobile", "Delete"));
