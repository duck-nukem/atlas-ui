import type { Meta } from "@storybook/react-vite";
import { html, mobile, productionContrast } from "../html";

const avatar = (initials: string, tone: number, size = "default") =>
  `<span class="ui-avatar" data-size="${size}"><span data-tone="${tone}">${initials}</span></span>`;

const avatars = `
<div style="display:flex;gap:.75rem;align-items:center">
  ${avatar("A", 4)}
  ${avatar("AL", 0)}
  ${avatar("D", 1, "sm")}
  ${avatar("GH", 6, "sm")}
</div>`;

const stack = `
<button class="ui-avatar-stack" type="button" aria-label="Ada Lovelace, Grace Hopper, Alan Turing and 2 more">
  <span class="ui-avatar-group">
    ${avatar("AL", 0, "sm")}${avatar("GH", 6, "sm")}${avatar("AT", 3, "sm")}
    <span class="ui-avatar-group-count">+2</span>
  </span>
</button>`;

export default { title: "Primitives/Avatar" } satisfies Meta;

export const Initials = html(avatars);

export const Stack = {
  ...html(stack),
  parameters: { ...html(stack).parameters, ...productionContrast },
};

export const Mobile = {
  ...mobile(stack),
  parameters: { ...mobile(stack).parameters, ...productionContrast },
};
