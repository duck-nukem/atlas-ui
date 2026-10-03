import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const confirm = (id: string, trigger: string, thing: string) => `
<button class="ui-button" data-variant="danger-ghost" data-size="sm" type="button" popovertarget="${id}"${trigger ? "" : ` data-shape="icon" aria-label="Delete ${thing}"`}>${icon("trash-2")}${trigger}</button>
<form class="ui-popover" id="${id}" popover method="post" action="#delete" role="alertdialog" aria-labelledby="${id}-message">
  <p id="${id}-message" style="margin-block-start:0">Delete this ${thing}? This cannot be undone.</p>
  <div class="ui-form-actions">
    <button class="ui-button" data-variant="ghost" data-size="sm" type="button" popovertarget="${id}" popovertargetaction="hide" autofocus>Cancel</button>
    <button class="ui-button" data-variant="danger" data-size="sm" type="submit">Delete ${thing}</button>
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

export const Default = html(confirm("delete-default", " Delete", "task"));

export const IconOnly = html(confirm("delete-icon", "", "comment"));

export const Mobile = mobile(confirm("delete-mobile", " Delete", "task"));
