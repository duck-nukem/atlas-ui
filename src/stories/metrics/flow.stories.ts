import type { Meta } from "@storybook/html-vite";
import { html, type Story } from "../html";
import {
  fourBands,
  inline,
  jumbo,
  type PanelArgs,
  tiles,
  type TilesArgs,
} from "./metrics";

const metric = (overrides: Partial<PanelArgs>): PanelArgs => ({
  label: "",
  rating: "",
  value: "",
  valueIsText: false,
  unit: "",
  amount: "",
  direction: "down",
  progress: "unchanged",
  note: "",
  scale: "",
  bands: "",
  current: 0,
  ...overrides,
});

export default {
  title: "Metrics/Flow",
  ...html<TilesArgs>(
    (args) => `<div class="ui-page">
  <section class="ui-section" data-gap="4" aria-labelledby="status-time-heading">
    <div class="ui-section-heading">
      <h2 id="status-time-heading">Where time is spent</h2>
      <p>How long the 224 tasks finished in the last 30 days stayed in each status, from the moment work on them started until they were released.</p>
    </div>
    <dl class="ui-metrics" data-order="lead-first">
      ${jumbo(metric({ label: "Bottleneck", rating: "error", value: "Awaiting deployment", valueIsText: true, unit: "Tasks spent 70% of their time in this status", amount: "−7%", scale: "% of time spent in one status", bands: fourBands("< 25%", "< 35%", "≤ 50%", "> 50%"), current: 3 }))}
      ${jumbo(metric({ label: "Lead time", value: "5.8d", unit: "from started to released, median", amount: "−2.5h" }))}
    </dl>
    ${tiles(args)}
  </section>
  <dl class="ui-metric-rows">
    ${inline(metric({ label: "Batch size", rating: "elite", value: "1.0", unit: "median tasks per release", amount: "−2.5", progress: "improved", scale: "Median tasks per release", bands: "Warning = < 1 | Excellent = < 5 | Good = < 11 | Warning = ≤ 20 | Needs attention = > 20", current: 1 }))}
    ${inline(metric({ label: "Work in progress", value: "5", unit: "in progress", note: '<a class="ui-link" href="#limit">Set a limit</a>' }))}
    ${inline(metric({ label: "Aged tasks", rating: "warning", value: "9", unit: "tasks have stayed in their status longer than usual", note: '<a class="ui-link" href="#aged">See which ones</a>' }))}
  </dl>
</div>`,
  ),
  args: {
    tiles:
      "Paused, 0, 0, 4.9d | Implementing, 3, 17, 15h | In review, 4, 3, 5h | Testing, 5, 10, 4h | Awaiting deployment, 6, 70, 4.8d",
    bottleneck: 4,
    alarm: "error",
  },
} satisfies Meta<TilesArgs>;

export const Default: Story<TilesArgs> = {};
