import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";
import { sparkline } from "./sparkline";

const ratings = {
  elite: "check-check",
  good: "circle-check",
  warning: "triangle-alert",
  error: "circle-alert",
};

const metric = (
  id: string,
  title: string,
  value: string,
  unit: string,
  rating: keyof typeof ratings,
  progress: "improved" | "worsened",
  delta: string,
  values: readonly number[],
  note: string,
) => `
<article class="ui-metric" aria-labelledby="${id}-title">
  <header class="ui-metric-header">
    <h3 id="${id}-title">${title}</h3>
    <button class="ui-button" data-variant="ghost" data-shape="icon" data-size="xs" type="button" popovertarget="${id}-help" interestfor="${id}-help" aria-label="About ${title.toLowerCase()}">${icon("info")}</button>
  </header>
  <div class="ui-popover ui-hovercard" id="${id}-help" popover><p><strong>${title}</strong></p><p>${note}</p></div>
  <p class="ui-metric-value">
    <data value="${value}">${value}</data><span class="ui-metric-unit">${unit}</span>
    <span class="ui-rating" data-rating="${rating}">${icon(ratings[rating])} ${rating[0]?.toUpperCase()}${rating.slice(1)}</span>
  </p>
  ${sparkline(values, progress, `${title} over the last 12 weeks, now ${value} ${unit}`)}
  <p class="ui-delta" data-progress="${progress}">${icon(delta.startsWith("+") ? "trending-up" : "trending-down")} <span class="ui-visually-hidden">${progress === "improved" ? "Improved" : "Worsened"}:</span> ${delta} vs the 4 weeks before</p>
</article>`;

const grid = `
<div class="ui-grid" style="--ui-grid-min:14rem">
  ${metric("deploys", "Deployment frequency", "4.2", "per day", "elite", "improved", "+12%", [3, 4, 3, 5, 6, 5, 7, 8, 7, 9, 10, 12], "How often the main branch reaches production.")}
  ${metric("lead", "Lead time", "2.5", "days", "good", "improved", "−0.8 days", [6, 5, 6, 5, 4, 4, 3, 4, 3, 3, 2, 2], "Time from first commit to production for the 85th percentile of changes.")}
  ${metric("failure", "Change failure rate", "18", "%", "warning", "worsened", "+4 pts", [9, 10, 9, 12, 11, 13, 14, 13, 15, 16, 17, 18], "Share of deployments that needed a fix or rollback.")}
  ${metric("restore", "Time to restore", "3", "days", "error", "worsened", "+1 day", [1, 1, 2, 1, 2, 2, 2, 3, 2, 3, 3, 3], "Time from an incident to its fix in production.")}
</div>`;

export default { title: "Charts/Metric" } satisfies Meta;

export const Dashboard = html(grid);

export const Single = html(
  `<div style="max-inline-size:18rem">${metric("single", "Lead time", "2.5", "days", "good", "improved", "−0.8 days", [6, 5, 6, 5, 4, 4, 3, 4, 3, 3, 2, 2], "Time from first commit to production for the 85th percentile of changes.")}</div>`,
);

export const Mobile = mobile(grid);
