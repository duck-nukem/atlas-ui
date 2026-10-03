import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const tabs = `
<nav class="ui-tabs" aria-label="Health">
  <a class="ui-tab" href="#metrics" aria-current="page">Metrics</a>
  <a class="ui-tab" href="#suggestions">Suggestions<span class="ui-dot" role="status" aria-label="Needs attention"></span></a>
</nav>`;

export default { title: "Layout/Tabs" } satisfies Meta;

export const Links = html(tabs);

export const Disabled = html(`
<nav class="ui-tabs" aria-label="Pull request">
  <a class="ui-tab" href="#conversation" aria-current="page">Conversation</a>
  <button class="ui-tab" type="button" aria-disabled="true">Commits</button>
</nav>`);

export const Mobile = mobile(tabs);

export const Views = html(`
<nav class="ui-views" aria-label="Task views">
  <a class="ui-view" href="#overview" aria-current="page">Overview</a>
  <a class="ui-view" href="#all">All tasks</a>
</nav>`);
