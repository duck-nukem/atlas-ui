import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const photo =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%2389b4fa'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23fff'/%3E%3Cellipse cx='20' cy='36' rx='13' ry='10' fill='%23fff'/%3E%3C/svg%3E";

const sizes = `
<div class="ui-button-group">
  <span class="ui-avatar" data-size="sm" data-tone="0" role="img" aria-label="Ada Lovelace">AL</span>
  <span class="ui-avatar" data-tone="3" role="img" aria-label="Grace Hopper">GH</span>
  <span class="ui-avatar" data-size="lg" data-tone="5" role="img" aria-label="Alan Turing">AT</span>
  <span class="ui-avatar" data-size="xl"><img src="${photo}" alt="Katherine Johnson"></span>
</div>`;

export default { title: "Primitives/Avatar" } satisfies Meta;

export const Sizes = html(sizes);

export const Image = html(
  `<span class="ui-avatar"><img src="${photo}" alt="Katherine Johnson"></span>`,
);

export const Stack = html(`
<div class="ui-avatar-stack" role="group" aria-label="Assignees">
  ${["AL", "GH", "AT", "KJ"].map((initials, tone) => `<span class="ui-avatar" data-size="sm" data-tone="${tone}" role="img" aria-label="${initials}">${initials}</span>`).join("")}
  <span class="ui-avatar" data-size="sm" role="img" aria-label="3 more">+3</span>
</div>`);

export const WithName = html(`
<span style="display:inline-flex;gap:.5rem;align-items:center">
  <span class="ui-avatar" data-size="sm" data-tone="4" aria-hidden="true">GH</span> Grace Hopper
</span>`);

export const Mobile = mobile(sizes);
