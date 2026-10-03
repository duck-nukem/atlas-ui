import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const toggle = `
<div class="ui-switch-row">
  <input class="ui-switch" id="chat-enabled" type="checkbox" role="switch" checked>
  <label for="chat-enabled">Turn on chat for this organization</label>
</div>`;

export default { title: "Primitives/Toggle" } satisfies Meta;

export const On = html(toggle);

export const Off = html(toggle.replace(" checked", ""));

export const Pending = html(toggle.replace(" checked", " checked disabled"));

export const Mobile = mobile(toggle);
