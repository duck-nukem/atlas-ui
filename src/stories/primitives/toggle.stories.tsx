import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const toggle = `
<label class="ui-label">
  <input class="ui-switch peer" type="checkbox" role="switch" checked>
  Chat
</label>`;

export default { title: "Primitives/Toggle" } satisfies Meta;

export const On = html(toggle);

export const Off = html(toggle.replace(" checked", ""));

export const Disabled = html(toggle.replace(" checked", " disabled"));

export const Mobile = mobile(toggle);
