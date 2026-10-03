import type { Meta } from "@storybook/react-vite";
import { html, type Story } from "../html";
import {
  type CardsArgs,
  fourBands,
  inline,
  jumbo,
  type PanelArgs,
  staleCards,
} from "./metrics";

const metric = (overrides: Partial<PanelArgs>): PanelArgs => ({
  label: "",
  rating: "",
  value: "",
  valueIsText: false,
  unit: "",
  amount: "",
  direction: "up",
  progress: "unchanged",
  note: "",
  scale: "",
  bands: "",
  current: 0,
  ...overrides,
});

type Args = CardsArgs;

export default {
  title: "Metrics/Health",
  ...html<Args>(
    (cards) => `<section class="ui-section" data-gap="4">
  <div class="ui-section-heading">
    <h2>Application health</h2>
    <p>Rated on the releases of the last 30 days. <a class="ui-link" href="#releases">See releases</a></p>
  </div>
  <dl class="ui-metrics">
    ${jumbo(metric({ label: "Release cadence", rating: "elite", value: "7.5", unit: "releases a week on average", amount: "+2.8", direction: "up", progress: "improved", scale: "Releases per week", bands: fourBands("> 7", "≥ 1", "≥ 0.25", "< 0.25") }))}
    ${jumbo(metric({ label: "Stability", rating: "error", value: "56%", unit: "of releases shipped without breaking anything", amount: "−14%", direction: "down", progress: "worsened", scale: "% of releases that weren't marked broken", bands: fourBands("> 85%", "> 80%", "≥ 70%", "< 70%"), current: 3 }))}
  </dl>
  <dl class="ui-metric-rows">
    ${inline(metric({ label: "Recovery", rating: "warning", value: "3.8d", unit: "on average to fix a broken release", amount: "+28.9h", direction: "up", scale: "Average time to fix a broken release", bands: fourBands("< 1h", "< 24h", "≤ 7d", "> 7d"), current: 2 }))}
    ${inline(metric({ label: "Rework", rating: "elite", value: "0%", unit: "of releases shipped nothing but unplanned work", amount: "−5%", direction: "down", progress: "improved", scale: "Releases with only fixes or other unplanned work", bands: fourBands("< 2%", "< 8%", "≤ 16%", "> 16%") }))}
    ${inline(metric({ label: "Unplanned work", rating: "good", value: "25%", unit: "of released tasks were unplanned", amount: "−9%", direction: "down", progress: "improved", scale: "Released tasks that were fixes or other unplanned work", bands: fourBands("< 10%", "< 25%", "≤ 40%", "> 40%"), current: 1 }))}
    ${inline(metric({ label: "Time to merge", rating: "elite", value: "10.7h", unit: "or less for 85% of merged pull requests", direction: "none", scale: "Time within which 85% of pull requests were merged", bands: fourBands("< 24h", "< 2d", "≤ 3d", "> 3d") }), staleCards(cards))}
  </dl>
</section>`,
  ),
  args: {
    count: 1,
    title: "test pr",
    repository: "Space Clone",
    openFor: "15d",
  },
} satisfies Meta<Args>;

export const Default: Story<Args> = {};
