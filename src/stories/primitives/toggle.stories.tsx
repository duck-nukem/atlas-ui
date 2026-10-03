import type { Meta } from "@storybook/react-vite";
import { html, type Story } from "../html";

type Args = { label: string; checked: boolean; disabled: boolean };

export default {
  title: "Primitives/Toggle",
  ...html<Args>(
    ({ label, checked, disabled }) => `<div class="ui-switch-row">
  <input class="ui-switch" id="toggle" type="checkbox" role="switch"${checked ? " checked" : ""}${disabled ? " disabled" : ""}>
  <label for="toggle">${label}</label>
</div>`,
  ),
  args: {
    label: "Turn on chat for this organization",
    checked: true,
    disabled: false,
  },
} satisfies Meta<Args>;

export const On: Story<Args> = {};

export const Off: Story<Args> = { args: { checked: false } };

export const Saving: Story<Args> = { args: { disabled: true } };
