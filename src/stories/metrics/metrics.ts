import { icon } from "../html";

export enum Rating {
  Elite = "elite",
  Good = "good",
  Warning = "warning",
  Error = "error",
}

const ratingIcons = {
  [Rating.Elite]: "check-check",
  [Rating.Good]: "circle-check",
  [Rating.Warning]: "triangle-alert",
  [Rating.Error]: "circle-alert",
};

const ratingNames = {
  [Rating.Elite]: "Excellent",
  [Rating.Good]: "Good",
  [Rating.Warning]: "Warning",
  [Rating.Error]: "Needs attention",
};

export type Trend =
  | {
      amount: string;
      up: boolean;
      progress: "improved" | "worsened" | "unchanged";
    }
  | "unchanged";

const ratingIcon = (label: string, rating: Rating | undefined) =>
  rating === undefined
    ? `<svg class="ui-icon ui-rating-icon" role="img" aria-label="${label}: No rating"><use href="icons.svg#circle-dashed"/></svg>`
    : `<svg class="ui-icon ui-rating-icon" data-rating="${rating}" role="img" aria-label="${label}: ${ratingNames[rating]}"><use href="icons.svg#${ratingIcons[rating]}"/></svg>`;

export const trendLine = (trend: Trend) =>
  trend === "unchanged"
    ? `<dd class="ui-trend">Same as 7 days ago</dd>`
    : `<dd class="ui-trend" data-progress="${trend.progress}">${icon(trend.up ? "trending-up" : "trending-down")}${trend.amount} compared with 7 days ago</dd>`;

export const rated = (
  id: string,
  label: string,
  rating: Rating,
  scale: string,
  bands: readonly (readonly [Rating, string])[],
  current = bands.findIndex(([band]) => band === rating),
) => `
<button class="ui-rating-link" type="button" popovertarget="${id}" aria-label="${label}: ${ratingNames[rating]}, show thresholds">${ratingNames[rating]}</button>
<div class="ui-popover ui-thresholds" data-size="hint" id="${id}" popover>
  <p>${scale}</p>
  <dl>
    ${bands
      .map(([band, range], index) => {
        const mark = index === current ? ' aria-current="true"' : "";

        return `<dt${mark}>${ratingNames[band]}</dt><dd${mark}>${range}</dd>`;
      })
      .join("")}
  </dl>
</div>`;

export const card = (options: {
  label: string;
  rating: Rating | undefined;
  value: string;
  valueIsText?: boolean;
  unit: string;
  trend: Trend;
  note: string;
}) => `
<div class="ui-metric"${options.rating === undefined ? "" : ` data-rating="${options.rating}"`}>
  <dt>${options.label}${ratingIcon(options.label, options.rating)}</dt>
  <dd class="ui-metric-value"${options.valueIsText === true ? " data-text" : ""}>${options.value}</dd>
  <dd class="ui-metric-unit">${options.unit}</dd>
  ${trendLine(options.trend)}
  <dd class="ui-metric-note">${options.note}</dd>
</div>`;

export const row = (options: {
  label: string;
  rating: Rating | undefined;
  value: string;
  unit: string;
  trend?: Trend;
  note: string;
}) => `
<div class="ui-metric-row">
  <dt>${ratingIcon(options.label, options.rating)}${options.label}</dt>
  <dd class="ui-metric-unit"><span>${options.value}</span> ${options.unit}</dd>
  <dd class="ui-metric-note">${options.note}</dd>
  ${options.trend === undefined ? "" : trendLine(options.trend)}
</div>`;
