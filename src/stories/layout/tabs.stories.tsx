import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const tabs = `
<nav class="ui-tabs" aria-label="Delivery sections">
  <a class="ui-tab" href="#metrics" aria-current="page">Metrics</a>
  <a class="ui-tab" href="#suggestions">Suggestions<span class="ui-tab-alert" role="img" aria-label="Something needs attention and nothing is adopted for it yet"></span></a>
</nav>`;

export default { title: "Layout/Tabs" } satisfies Meta;

export const Links = html(tabs);

export const Disabled = html(`
<nav class="ui-tabs" aria-label="Delivery sections">
  <a class="ui-tab" href="#metrics" aria-current="page">Metrics</a>
  <button class="ui-tab" type="button" aria-disabled="true" popovertarget="nothing-found" interestfor="nothing-found">Suggestions</button>
</nav>
<div class="ui-popover" data-size="hint" id="nothing-found" popover data-text="sm">No larger problem stands out right now. If a single metric slips, the Metrics tab and the Flow page suggest what helps with it.</div>
`);

export const Mobile = mobile(tabs);

export const Views = html(`
<nav class="ui-views" aria-label="Task views">
  <a class="ui-view" href="#overview" aria-current="page">Overview</a>
  <a class="ui-view" href="#all">All tasks</a>
</nav>`);
