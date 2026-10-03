import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const badges = `
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <span class="ui-badge" data-variant="secondary">Bug</span>
  <span class="ui-badge" data-variant="outline">v1.4.0</span>
</div>`;

export default { title: "Primitives/Badge" } satisfies Meta;

export const Variants = html(badges);

export const Mobile = mobile(badges);
