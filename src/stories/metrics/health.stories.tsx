import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, mobile } from "../html";
import { card, rated, Rating, row } from "./metrics";

const health = `
<section class="ui-section" style="gap:1rem">
  <div class="ui-section-heading">
    <h2>Application health</h2>
    <p>Rated on the releases of the last 30 days. <a href="#releases" style="text-decoration:underline">See releases</a></p>
  </div>
  <dl class="ui-metrics">
    ${card({
      label: "Release cadence",
      rating: Rating.Elite,
      value: "7.5",
      unit: "releases a week on average",
      trend: { amount: "+2.8", up: true, progress: "improved" },
      note: rated(
        "cadence",
        "Release cadence",
        Rating.Elite,
        "Releases per week",
        [
          [Rating.Elite, "> 7"],
          [Rating.Good, "≥ 1"],
          [Rating.Warning, "≥ 0.25"],
          [Rating.Error, "< 0.25"],
        ],
      ),
    })}
    ${card({
      label: "Stability",
      rating: Rating.Error,
      value: "56%",
      unit: "of releases shipped without breaking anything",
      trend: { amount: "−14%", up: false, progress: "worsened" },
      note: rated(
        "stability",
        "Stability",
        Rating.Error,
        "% of releases that weren't marked broken",
        [
          [Rating.Elite, "> 85%"],
          [Rating.Good, "> 80%"],
          [Rating.Warning, "≥ 70%"],
          [Rating.Error, "< 70%"],
        ],
      ),
    })}
  </dl>
  <dl class="ui-metric-rows">
    ${row({
      label: "Recovery",
      rating: Rating.Warning,
      value: "3.8d",
      unit: "on average to fix a broken release",
      trend: { amount: "+28.9h", up: true, progress: "worsened" },
      note: rated(
        "recovery",
        "Recovery",
        Rating.Warning,
        "Average time to fix a broken release",
        [
          [Rating.Elite, "< 1h"],
          [Rating.Good, "< 24h"],
          [Rating.Warning, "≤ 7d"],
          [Rating.Error, "> 7d"],
        ],
      ),
    })}
    ${row({
      label: "Rework",
      rating: Rating.Elite,
      value: "0%",
      unit: "of releases shipped nothing but unplanned work",
      trend: { amount: "−5%", up: false, progress: "improved" },
      note: rated(
        "rework",
        "Rework",
        Rating.Elite,
        "Releases with only fixes or other unplanned work",
        [
          [Rating.Elite, "< 2%"],
          [Rating.Good, "< 8%"],
          [Rating.Warning, "≤ 16%"],
          [Rating.Error, "> 16%"],
        ],
      ),
    })}
    ${row({
      label: "Unplanned work",
      rating: Rating.Good,
      value: "25%",
      unit: "of released tasks were unplanned",
      trend: { amount: "−9%", up: false, progress: "improved" },
      note: rated(
        "unplanned",
        "Unplanned work",
        Rating.Good,
        "Released tasks that were fixes or other unplanned work",
        [
          [Rating.Elite, "< 10%"],
          [Rating.Good, "< 25%"],
          [Rating.Warning, "≤ 40%"],
          [Rating.Error, "> 40%"],
        ],
      ),
    })}
    ${row({
      label: "Time to merge",
      rating: Rating.Elite,
      value: "10.7h",
      unit: "or less for 85% of merged pull requests",
      trend: "unchanged",
      note: rated(
        "merge",
        "Time to merge",
        Rating.Elite,
        "Time within which 85% of pull requests were merged",
        [
          [Rating.Elite, "< 24h"],
          [Rating.Good, "< 2d"],
          [Rating.Warning, "≤ 3d"],
          [Rating.Error, "> 3d"],
        ],
      ),
    })}
  </dl>
</section>`;

export default {
  title: "Metrics/Health",
} satisfies Meta;

export const Default = html(health);

export const Thresholds: StoryObj = {
  ...html(health),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", {
        name: "Release cadence: Excellent, show thresholds",
      }),
    );

    await expect(canvas.getByText("Releases per week")).toBeVisible();
  },
};

export const Mobile = mobile(health);
