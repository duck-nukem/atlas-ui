import { icon } from "../html";

export const ratings = ["", "elite", "good", "warning", "error"] as const;

export type Rating = (typeof ratings)[number];

const ratingIcons: Record<Exclude<Rating, "">, string> = {
  elite: "check-check",
  good: "circle-check",
  warning: "triangle-alert",
  error: "circle-alert",
};

export const ratingNames: Record<Exclude<Rating, "">, string> = {
  elite: "Excellent",
  good: "Good",
  warning: "Warning",
  error: "Needs attention",
};

export const progresses = ["improved", "worsened", "unchanged"] as const;

export type TrendArgs = {
  amount: string;
  direction: "up" | "down" | "none";
  progress: (typeof progresses)[number];
};

export const trend = ({ amount, direction, progress }: TrendArgs) =>
  direction === "none"
    ? `<dd class="ui-trend">Same as 7 days ago</dd>`
    : `<dd class="ui-trend" data-progress="${progress}">${icon(direction === "up" ? "trending-up" : "trending-down")}${amount} compared with 7 days ago</dd>`;

export const ratingIcon = (label: string, rating: Rating) =>
  rating === ""
    ? `<svg class="ui-icon ui-rating-icon" role="img" aria-label="${label}: No rating"><use href="icons.svg#circle-dashed"/></svg>`
    : `<svg class="ui-icon ui-rating-icon" data-rating="${rating}" role="img" aria-label="${label}: ${ratingNames[rating]}"><use href="icons.svg#${ratingIcons[rating]}"/></svg>`;

export type ThresholdArgs = {
  id: string;
  label: string;
  rating: Exclude<Rating, "">;
  scale: string;
  bands: string;
  current: number;
};

export const thresholds = ({
  id,
  label,
  rating,
  scale,
  bands,
  current,
}: ThresholdArgs) => `<button class="ui-rating-link" type="button" popovertarget="${id}" aria-label="${label}: ${ratingNames[rating]}, show thresholds">${ratingNames[rating]}</button>
<div class="ui-popover ui-thresholds" data-size="thresholds" id="${id}" popover>
  <p>${scale}</p>
  <dl>
    ${bands
      .split(";")
      .map((band, index) => {
        const [name, range] = band.split("=").map((part) => part.trim());
        const mark = index === current ? ' aria-current="true"' : "";

        return `<dt${mark}>${name}</dt><dd${mark}>${range}</dd>`;
      })
      .join("\n    ")}
  </dl>
</div>`;

export type PanelArgs = TrendArgs & {
  label: string;
  rating: Rating;
  value: string;
  valueIsText: boolean;
  unit: string;
  note: string;
  scale: string;
  bands: string;
  current: number;
};

const note = (args: PanelArgs) =>
  args.note !== ""
    ? args.note
    : args.rating === ""
      ? "Not rated yet"
      : thresholds({
          ...args,
          id: args.label.toLowerCase().replaceAll(" ", "-"),
          rating: args.rating,
        });

export const jumbo = (
  args: PanelArgs,
) => `<div class="ui-metric"${args.rating === "" ? "" : ` data-rating="${args.rating}"`}>
  <dt>${args.label}${ratingIcon(args.label, args.rating)}</dt>
  <dd class="ui-metric-value"${args.valueIsText ? " data-text" : ""}>${args.value}</dd>
  <dd class="ui-metric-unit">${args.unit}</dd>
  ${trend(args)}
  <dd class="ui-metric-note">${note(args)}</dd>
</div>`;

export const inline = (
  args: PanelArgs,
  details = "",
) => `<div class="ui-metric-row">
  <dt>${ratingIcon(args.label, args.rating)}${args.label}</dt>
  <dd class="ui-metric-unit"><span>${args.value}</span> ${args.unit}</dd>
  <dd class="ui-metric-note">${note(args)}</dd>
  ${args.amount === "" && args.direction !== "none" ? "" : trend(args)}${details === "" ? "" : `\n  <dd class="ui-metric-details">${details}</dd>`}
</div>`;

export const fourBands = (
  excellent: string,
  good: string,
  warning: string,
  attention: string,
) =>
  `Excellent = ${excellent}; Good = ${good}; Warning = ${warning}; Needs attention = ${attention}`;

export type CardsArgs = {
  count: number;
  title: string;
  repository: string;
  openFor: string;
  external: boolean;
};

export const staleCards = ({
  count,
  title,
  repository,
  openFor,
  external,
}: CardsArgs) => `<div class="ui-cards">
  <p id="stale">${count} ${count === 1 ? "pull request" : "pull requests"} open for more than three days</p>
  <ol aria-labelledby="stale">
    ${Array.from(
      { length: count },
      (_, index) => `<li><a class="ui-card-link" href="#pr-${23 + index}">
      <span><span><span>#${23 + index}</span> ${title}</span><span>open ${openFor}</span></span>
      <span><span class="ui-badge" data-variant="secondary"><span>${repository}</span>${external ? icon("external-link") : ""}</span></span>
    </a></li>`,
    ).join("\n    ")}
  </ol>
</div>`;

export type TilesArgs = {
  tiles: string;
  bottleneck: number;
  alarm: "" | "warning" | "error";
};

export const tiles = ({
  tiles: list,
  bottleneck,
  alarm,
}: TilesArgs) => `<ol class="ui-status-tiles" aria-label="Where time is spent">
  ${list
    .split(";")
    .map((tile, index) => {
      const [status = "", step = "0", share = "0", median = ""] = tile
        .split(",")
        .map((part) => part.trim());
      const isBottleneck = index === bottleneck;

      return `<li data-step="${step}" style="--ui-share:${share}%"${isBottleneck ? ` data-bottleneck${alarm === "" ? "" : ` data-alarm="${alarm}"`}` : ""}>
    <span>${status}</span><span>${share}%</span><span>median ${median}</span>
  </li>`;
    })
    .join("\n  ")}
</ol>`;
