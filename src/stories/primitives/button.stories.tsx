import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const buttons = `
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <a class="ui-button" href="#new">New task</a>
  <button class="ui-button" data-variant="outline" type="button">Cancel</button>
  <button class="ui-button" data-variant="secondary" type="button">Cancel</button>
  <button class="ui-button" data-variant="ghost" type="button">Cancel</button>
  <button class="ui-button" data-variant="destructive" type="button">Delete task</button>
  <button class="ui-button" data-variant="link" type="button">Account</button>
</div>`;

export default { title: "Primitives/Button" } satisfies Meta;

export const Variants = html(buttons);

export const Small = html(`
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <button class="ui-button" data-size="sm" type="button">New task</button>
  <button class="ui-button" data-variant="outline" data-size="sm" type="button">Cancel</button>
  <button class="ui-button" data-variant="ghost" data-size="sm" type="button">Cancel</button>
</div>`);

export const Icons = html(`
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <button class="ui-button" data-variant="ghost" data-size="icon" type="button" aria-label="Open navigation">${icon("menu", "5")}</button>
  <a class="ui-button" data-variant="ghost" data-size="icon" href="#notifications" aria-label="Notifications">${icon("bell")}</a>
  <button class="ui-button" data-variant="ghost" data-size="icon" type="button" aria-label="Toggle light or dark mode">${icon("sun-moon")}</button>
  <button class="ui-button" data-variant="ghost" data-size="icon-sm" type="button" aria-label="Close">${icon("x")}</button>
</div>`);

export const Pending = html(
  `<button class="ui-button" type="submit" disabled>New task</button>`,
);

export const Mobile = mobile(buttons);
