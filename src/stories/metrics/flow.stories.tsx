import type { Meta } from "@storybook/react-vite";
import { mobile, withProductionContrast, html } from "../html";
import { card, rated, Rating, row } from "./metrics";

const tiles = [
  ["Paused", 0, "0%", "4.9d", 0],
  ["Implementing", 3, "17%", "15h", 17],
  ["In review", 4, "3%", "5h", 3],
  ["Testing", 5, "10%", "4h", 10],
  ["Awaiting deployment", 6, "70%", "4.8d", 70],
] as const;

const flow = `
<div class="ui-page">
<section class="ui-section" data-gap="4" aria-labelledby="status-time-heading">
  <div class="ui-section-heading">
    <h2 id="status-time-heading">Where time is spent</h2>
    <p>How long the 224 tasks finished in the last 30 days stayed in each status, from the moment work on them started until they were released.</p>
  </div>
  <dl class="ui-metrics" data-order="lead-first">
    ${card({
      label: "Bottleneck",
      rating: Rating.Error,
      value: "Awaiting deployment",
      valueIsText: true,
      unit: "Tasks spent 70% of their time in this status",
      trend: { amount: "−7%", up: false, progress: "unchanged" },
      note: rated(
        "bottleneck",
        "Bottleneck",
        Rating.Error,
        "% of time spent in one status",
        [
          [Rating.Elite, "< 25%"],
          [Rating.Good, "< 35%"],
          [Rating.Warning, "≤ 50%"],
          [Rating.Error, "> 50%"],
        ],
      ),
    })}
    ${card({ label: "Lead time", rating: undefined, value: "5.8d", unit: "from started to released, median", trend: { amount: "−2.5h", up: false, progress: "unchanged" }, note: "Not rated yet" })}
  </dl>
  <ol class="ui-status-tiles" aria-label="Where time is spent">
    ${tiles
      .map(
        ([status, step, share, median, percent]) => `
    <li data-step="${step}" style="--ui-share:${percent}%"${status === "Awaiting deployment" ? ' data-bottleneck data-alarm="error"' : ""}>
      <span>${status}</span><span>${share}</span><span>median ${median}</span>
    </li>`,
      )
      .join("")}
  </ol>
</section>
  <dl class="ui-metric-rows">
    ${row({
      label: "Batch size",
      rating: Rating.Elite,
      value: "1.0",
      unit: "median tasks per release",
      trend: { amount: "−2.5", up: false, progress: "improved" },
      note: rated(
        "batch",
        "Batch size",
        Rating.Elite,
        "Median tasks per release",
        [
          [Rating.Warning, "< 1"],
          [Rating.Elite, "< 5"],
          [Rating.Good, "< 11"],
          [Rating.Warning, "≤ 20"],
          [Rating.Error, "> 20"],
        ],
        1,
      ),
    })}
    ${row({ label: "Work in progress", rating: undefined, value: "5", unit: "in progress", note: '<a href="#limit" class="ui-link">Set a limit</a>' })}
    ${row({ label: "Aged tasks", rating: Rating.Warning, value: "9", unit: "tasks have stayed in their status longer than usual", note: '<a href="#aged" class="ui-link">See which ones</a>' })}
  </dl>
</div>`;

export default {
  title: "Metrics/Flow",
  parameters: {
    docs: {
      description: {
        component:
          "Each status tile fills from the bottom to its share of the time; data-step picks the status colour and data-alarm colours a bottleneck that needs attention.",
      },
    },
  },
} satisfies Meta;

export const Default = withProductionContrast(html(flow));

export const Mobile = withProductionContrast(mobile(flow));
