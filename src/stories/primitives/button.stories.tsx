import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const variants = `
<div class="ui-button-group">
  <button class="ui-button" type="button">Save</button>
  <button class="ui-button" data-variant="outline" type="button">Cancel</button>
  <button class="ui-button" data-variant="secondary" type="button">Draft</button>
  <button class="ui-button" data-variant="ghost" type="button">Skip</button>
  <button class="ui-button" data-variant="danger" type="button">Delete</button>
  <button class="ui-button" data-variant="danger-ghost" type="button">Remove</button>
  <a class="ui-button" data-variant="link" href="#docs">Read the docs</a>
</div>`;

export default { title: "Primitives/Button" } satisfies Meta;

export const Variants = html(variants);

export const Sizes = html(`
<div class="ui-button-group">
  <button class="ui-button" data-size="xs" type="button">Extra small</button>
  <button class="ui-button" data-size="sm" type="button">Small</button>
  <button class="ui-button" type="button">Default</button>
  <button class="ui-button" data-size="lg" type="button">Large</button>
</div>`);

export const States = html(`
<div class="ui-button-group">
  <button class="ui-button" type="button" disabled>Disabled</button>
  <button class="ui-button" type="submit" aria-busy="true">Saving</button>
  <button class="ui-button" data-variant="outline" type="button" aria-pressed="true">Pinned</button>
  <a class="ui-button" data-variant="outline" aria-disabled="true">Unavailable link</a>
</div>`);

export const WithIcons = html(`
<div class="ui-button-group">
  <button class="ui-button" type="button">${icon("plus")} New task</button>
  <button class="ui-button" data-variant="outline" type="button">Next ${icon("chevron-right")}</button>
  <button class="ui-button" data-variant="ghost" data-shape="icon" type="button" aria-label="Settings">${icon("settings")}</button>
  <button class="ui-button" data-variant="outline" data-shape="icon" data-size="sm" type="button" aria-label="Edit">${icon("pencil")}</button>
</div>`);

export const Mobile = mobile(variants);
