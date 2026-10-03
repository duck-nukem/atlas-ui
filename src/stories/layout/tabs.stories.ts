import type { Meta } from "@storybook/html-vite";
import { html, type Story } from "../html";

type Args = {
  label: string;
  tabs: string;
  current: number;
  alert: number;
  count: number;
  countOn: number;
  disabled: number;
};

export default {
  title: "Layout/Tabs",
  ...html<Args>(
    ({
      label,
      tabs,
      current,
      alert,
      count,
      countOn,
      disabled,
    }) => `<nav class="ui-tabs" aria-label="${label}">
  ${tabs
    .split(",")
    .map((tab, index) => {
      const extra = `${index === alert ? '<span class="ui-tab-alert" role="img" aria-label="Something needs attention and nothing is adopted for it yet"></span>' : ""}${index === countOn && count > 0 ? `<span class="ui-badge" data-variant="secondary">${count}</span>` : ""}`;

      return index === disabled
        ? `<button class="ui-tab" type="button" aria-disabled="true">${tab.trim()}${extra}</button>`
        : `<a class="ui-tab" href="#${index}"${index === current ? ' aria-current="page"' : ""}>${tab.trim()}${extra}</a>`;
    })
    .join("\n  ")}
</nav>`,
  ),
  args: {
    label: "Delivery sections",
    tabs: "Metrics, Suggestions",
    current: 0,
    alert: 1,
    count: 0,
    countOn: -1,
    disabled: -1,
  },
} satisfies Meta<Args>;

export const WithAlert: Story<Args> = {};

export const WithCount: Story<Args> = {
  args: {
    label: "Repository sections",
    tabs: "Overview, Commits, Branches, Files, Pull requests, Releases, Settings",
    current: 1,
    alert: -1,
    count: 2,
    countOn: 4,
  },
};

export const Disabled: Story<Args> = { args: { alert: -1, disabled: 1 } };

type ViewArgs = { current: "Overview" | "All tasks" };

export const Views: Story<ViewArgs> = {
  ...html<ViewArgs>(
    ({ current }) => `<nav class="ui-views" aria-label="Task views">
  ${["Overview", "All tasks"].map((view) => `<a class="ui-view" href="#${view}"${view === current ? ' aria-current="page"' : ""}>${view}</a>`).join("\n  ")}
</nav>`,
  ),
  args: { current: "Overview" },
  argTypes: {
    current: { control: "inline-radio", options: ["Overview", "All tasks"] },
  },
};
