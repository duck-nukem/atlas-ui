import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const statuses = ["Blocked", "Ready", "In progress", "In review", "Done"];
const days = Array.from(
  { length: 14 },
  (_, day) =>
    [
      `${day + 1} Oct`,
      [
        day % 5 === 0 ? 2 : 1,
        4 - (day % 3),
        3 + (day % 4),
        2 + (day % 2),
        4 + day,
      ],
    ] as const,
);
const max = 30;

const chart = `
<figure class="ui-bar-chart" aria-labelledby="flow-title">
  <figcaption id="flow-title">Work in each status per day</figcaption>
  <ul class="ui-legend" aria-hidden="true">
    ${statuses.map((status, index) => `<li data-series="${index}">${status}</li>`).join("")}
  </ul>
  <div class="ui-bars" aria-hidden="true">
    <ul class="ui-bars-axis"><li>0</li><li>15</li><li>${max}</li></ul>
    <ol class="ui-bars-plot" style="--ui-max:${max}">
      ${days
        .map(
          ([label, counts]) => `
      <li class="ui-bar" style="--ui-total:${counts.reduce((sum, count) => sum + count, 0)}">
        ${counts.map((count, index) => (count === 0 ? "" : `<span data-series="${index}" style="--ui-value:${count}"></span>`)).join("")}
        <div class="ui-bar-tip">${label}: ${counts.map((count, index) => `${statuses[index]} ${count}`).join(", ")}</div>
      </li>`,
        )
        .join("")}
    </ol>
    <ol class="ui-bars-labels">${days.map(([label], index) => `<li>${index % 6 === 0 ? label : ""}</li>`).join("")}</ol>
  </div>
  <details>
    <summary>Show as table</summary>
    <div class="ui-table-scroll" role="region" aria-label="Work in each status per day" tabindex="0">
      <table class="ui-table">
        <thead><tr><th scope="col">Day</th>${statuses.map((status) => `<th scope="col" data-align="end">${status}</th>`).join("")}</tr></thead>
        <tbody>
          ${days.map(([label, counts]) => `<tr><th scope="row">${label}</th>${counts.map((count) => `<td data-align="end">${count}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  </details>
</figure>`;

export default {
  title: "Charts/Flow bar chart",
  parameters: {
    docs: {
      description: {
        component:
          "Stacked columns sized by --ui-total over --ui-max, with segments sized by --ui-value. Hovering a column shows its counts. The table holds the same numbers for keyboard, touch and screen reader users. Leave out segments with a value of 0.",
      },
    },
  },
} satisfies Meta;

export const Default = html(chart);

export const Mobile = mobile(chart);
