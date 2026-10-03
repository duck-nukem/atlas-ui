import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const buttons = `
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <button class="ui-button" type="button">New task</button>
  <button class="ui-button" data-variant="outline" type="button">Cancel</button>
  <button class="ui-button" data-variant="ghost" type="button">Skip</button>
  <button class="ui-button" data-variant="destructive" type="button">Delete task</button>
</div>`;

export default { title: "Primitives/Button" } satisfies Meta;

export const Variants = html(buttons);

export const Small = html(`
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <button class="ui-button" data-size="sm" type="button">Save</button>
  <button class="ui-button" data-variant="outline" data-size="sm" type="button">Cancel</button>
  <button class="ui-button" data-variant="ghost" data-size="sm" type="button">Edit</button>
</div>`);

export const Icons = html(`
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <a class="ui-button" data-variant="ghost" data-size="icon" href="#docs" aria-label="Docs">${icon("book")}</a>
  <button class="ui-button" data-variant="ghost" data-size="icon" type="button" aria-label="Notifications">${icon("bell")}</button>
  <button class="ui-button" data-variant="ghost" data-size="icon-sm" type="button" aria-label="More actions">${icon("ellipsis")}</button>
  <button class="ui-button" data-variant="outline" type="button">${icon("plus")} Add</button>
</div>`);

export const States = html(`
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <button class="ui-button" type="submit" disabled>Saving</button>
  <button class="ui-button" data-variant="outline" type="button" aria-expanded="true">Open menu</button>
  <button class="ui-button" data-variant="outline" type="button" aria-invalid="true">Invalid</button>
</div>`);

export const Mobile = mobile(buttons);
