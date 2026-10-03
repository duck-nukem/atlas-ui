import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const variants = `
<div class="ui-button-group">
  <span class="ui-badge">New</span>
  <span class="ui-badge" data-variant="secondary">Draft</span>
  <span class="ui-badge" data-variant="outline">v1.4</span>
  <span class="ui-badge" data-variant="danger">Blocked</span>
  <a class="ui-badge" data-variant="outline" href="#t-12">T-12</a>
</div>`;

export default { title: "Primitives/Badge" } satisfies Meta;

export const Variants = html(variants);

export const Tones = html(`
<div class="ui-button-group">
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((tone) => `<span class="ui-badge" data-tone="${tone}">Label ${tone}</span>`).join("")}
</div>`);

export const Chips = html(`
<div class="ui-button-group">
  <span class="ui-badge" data-variant="secondary">${icon("funnel")} Status: ready
    <button class="ui-badge-remove" type="button" aria-label="Remove filter Status">${icon("x", "sm")}</button>
  </span>
  <span class="ui-badge" data-tone="2">Backend
    <button class="ui-badge-remove" type="button" aria-label="Remove label Backend">${icon("x", "sm")}</button>
  </span>
</div>`);

export const Mobile = mobile(variants);
