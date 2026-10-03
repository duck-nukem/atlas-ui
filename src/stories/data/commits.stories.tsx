import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";

const commits = [
  [
    "931da0f",
    "Show chat join and leave lines small and in the chart green",
    "passed",
    "Grace Hopper",
  ],
  [
    "be979e5",
    "Parse task, goal and feature keys before looking them up",
    "failed",
    "",
  ],
  ["2b58c24", "Brand task, goal and feature keys on entities and rows", "", ""],
] as const;

type Args = {
  count: number;
  ci: boolean;
  review: boolean;
  author: string;
  date: string;
};

const mark = (sha: string, outcome: string, date: string) =>
  outcome === ""
    ? '<span class="ui-mark-space" aria-hidden="true"></span>'
    : `<button class="ui-mark" data-outcome="${outcome}" type="button" popovertarget="ci-${sha}" interestfor="ci-${sha}" aria-label="check: ${outcome === "passed" ? "Passed" : "Failed"}">${outcome === "passed" ? "✓" : "✗"}</button>
    <div class="ui-popover" data-size="hint" id="ci-${sha}" popover>
      <dl class="ui-details">
        <dt>Name</dt><dd>check</dd>
        <dt>Outcome</dt><dd>${outcome === "passed" ? "Passed" : "Failed"}</dd>
        <dt>Finished</dt><dd>${date}, 09:41</dd>
        <dt>Command</dt><dd class="ui-mono">npm run check</dd>${outcome === "failed" ? "\n        <dt>Summary</dt><dd>2 tests failed</dd>" : ""}
      </dl>
    </div>`;

const approval = (reviewer: string) =>
  reviewer === ""
    ? '<span class="ui-mark-space" aria-hidden="true"></span>'
    : `<span class="ui-approved" role="img" aria-label="Reviewed by ${reviewer}" title="Reviewed by ${reviewer}">✓</span>`;

export default {
  title: "Data/Commit list",
  ...html<Args>(({ count, ci, review, author, date }) =>
    count === 0
      ? '<p class="ui-empty">No commits.</p>'
      : `<ol class="ui-item-list">
  ${commits
    .slice(0, count)
    .map(
      ([sha, subject, outcome, reviewer]) => `<li class="ui-commit">
    ${ci ? mark(sha, outcome, date) : ""}${review ? approval(reviewer) : ""}
    <a class="ui-commit-sha" href="#${sha}">${sha}</a>
    <span class="ui-commit-subject">${review ? `<a href="#review-${sha}">${subject}</a>` : subject}</span>
    <span class="ui-commit-author">${author}</span>
    <time datetime="2026-10-03">${date}</time>
  </li>`,
    )
    .join("\n  ")}
</ol>`,
  ),
  args: {
    count: 3,
    ci: true,
    review: false,
    author: "alex szabo",
    date: "3 Oct 2026",
  },
  argTypes: { count: { control: { type: "range", min: 0, max: 3 } } },
} satisfies Meta<Args>;

export const WithChecks: Story<Args> = {};

export const InReview: Story<Args> = { args: { ci: false, review: true } };

export const Empty: Story<Args> = { args: { count: 0 } };

export const CheckDetails: Story<Args> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "check: Failed" }),
    );

    await expect(canvas.getByText("2 tests failed")).toBeVisible();
  },
};
