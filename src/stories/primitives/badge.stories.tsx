import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const badges = `
<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
  <span class="ui-badge">Active</span>
  <span class="ui-badge" data-variant="secondary">Evaluating</span>
  <span class="ui-badge" data-variant="outline">Draft</span>
  <span class="ui-badge" data-variant="destructive">Failed</span>
</div>`;

export default { title: "Primitives/Badge" } satisfies Meta;

export const GoalStatuses = html(badges);

export const Mobile = mobile(badges);
