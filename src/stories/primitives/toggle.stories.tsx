import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const toggles = `
<fieldset class="ui-fieldset">
  <legend>Notifications</legend>
  <label class="ui-check"><input class="ui-switch" type="checkbox" role="switch" checked> Email notifications</label>
  <label class="ui-check"><input class="ui-switch" type="checkbox" role="switch"> Weekly digest</label>
  <label class="ui-check"><input class="ui-switch" type="checkbox" role="switch" disabled> Push notifications</label>
</fieldset>`;

export default { title: "Primitives/Toggle" } satisfies Meta;

export const Default = html(toggles);

export const WithHint = html(`
<div class="ui-field">
  <label class="ui-check"><input class="ui-switch" type="checkbox" role="switch" aria-describedby="wip-hint" checked> Limit work in progress</label>
  <p class="ui-hint" id="wip-hint">New tasks wait until a slot frees up</p>
</div>`);

export const Mobile = mobile(toggles);
