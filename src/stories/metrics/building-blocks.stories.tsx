import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, productionContrast, select, type Story } from "../html";
import {
  type CardsArgs,
  fourBands,
  inline,
  jumbo,
  type PanelArgs,
  progresses,
  ratingNames,
  ratings,
  staleCards,
  thresholds,
  type ThresholdArgs,
  tiles,
  type TilesArgs,
  trend,
  type TrendArgs,
} from "./metrics";

const cadence: PanelArgs = {
  label: "Release cadence",
  rating: "elite",
  value: "7.5",
  valueIsText: false,
  unit: "releases a week on average",
  amount: "+2.8",
  direction: "up",
  progress: "improved",
  note: "",
  scale: "Releases per week",
  bands: fourBands("> 7", "≥ 1", "≥ 0.25", "< 0.25"),
  current: 0,
};

const panelControls = {
  rating: select(ratings),
  direction: {
    control: "inline-radio" as const,
    options: ["up", "down", "none"],
  },
  progress: select(progresses),
};

export default { title: "Metrics/Building blocks" } satisfies Meta;

export const JumboPanel: Story<PanelArgs> = {
  ...html<PanelArgs>(
    (args) => `<dl style="max-width:34rem">${jumbo(args)}</dl>`,
  ),
  args: cadence,
  argTypes: panelControls,
};

export const InlinePanel: Story<PanelArgs> = {
  ...html<PanelArgs>(
    (args) => `<dl class="ui-metric-rows">${inline(args)}</dl>`,
  ),
  args: {
    ...cadence,
    label: "Recovery",
    rating: "warning",
    value: "3.8d",
    unit: "on average to fix a broken release",
    amount: "+28.9h",
    progress: "unchanged",
    scale: "Average time to fix a broken release",
    bands: fourBands("< 1h", "< 24h", "≤ 7d", "> 7d"),
    current: 2,
  },
  argTypes: panelControls,
};

export const Trend: Story<TrendArgs> = {
  ...html<TrendArgs>(
    (args) =>
      `<dl><dt class="ui-sr-only">Release cadence</dt>${trend(args)}</dl>`,
  ),
  args: { amount: "+2.8", direction: "up", progress: "improved" },
  argTypes: {
    direction: panelControls.direction,
    progress: panelControls.progress,
  },
};

export const RatingBands: Story<ThresholdArgs> = {
  ...html<ThresholdArgs>(
    (args) =>
      `<p style="font-size:.875rem;font-weight:500">${thresholds(args)}</p>`,
  ),
  args: {
    id: "bands",
    label: "Batch size",
    rating: "elite",
    scale: "Median tasks per release",
    bands:
      "Warning = < 1; Excellent = < 5; Good = < 11; Warning = ≤ 20; Needs attention = > 20",
    current: 1,
  },
  argTypes: { rating: select(Object.keys(ratingNames)) },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole("button", {
        name: `${args.label}: ${ratingNames[args.rating]}, show thresholds`,
      }),
    );

    await expect(canvas.getByText(args.scale)).toBeVisible();
  },
};

export const StatusTiles: Story<TilesArgs> = {
  ...html(tiles),
  args: {
    tiles:
      "Paused, 0, 0, 4.9d; Implementing, 3, 17, 15h; In review, 4, 3, 5h; Testing, 5, 10, 4h; Awaiting deployment, 6, 70, 4.8d",
    bottleneck: 4,
    alarm: "error",
  },
  argTypes: { alarm: select(["", "warning", "error"]) },
  parameters: { ...html(tiles).parameters, ...productionContrast },
};

export const PullRequestCards: Story<CardsArgs> = {
  ...html(staleCards),
  args: {
    count: 4,
    title: "Show field errors with one FormFeedback component",
    repository: "Space Clone",
    openFor: "15d",
    external: false,
  },
  argTypes: { count: { control: { type: "range", min: 1, max: 8 } } },
};
