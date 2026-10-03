import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, mobile } from "../html";

const commits = [
  [
    "931da0f",
    "Show chat join and leave lines small and in the chart green",
    "alex szabo",
    "3 Oct 2026",
    "passed",
  ],
  [
    "be979e5",
    "Parse task, goal and feature keys before looking them up",
    "alex szabo",
    "3 Oct 2026",
    "failed",
  ],
  [
    "2b58c24",
    "Brand task, goal and feature keys on entities and rows",
    "alex szabo",
    "2 Oct 2026",
    "passed",
  ],
] as const;

const list = `
<ol class="ui-item-list">
  ${commits
    .map(
      ([sha, subject, author, date, outcome]) => `
  <li class="ui-commit">
    <button class="ui-mark" data-outcome="${outcome}" type="button" popovertarget="ci-${sha}" interestfor="ci-${sha}" aria-label="check: ${outcome === "passed" ? "Passed" : "Failed"}">${outcome === "passed" ? "✓" : "✗"}</button>
    <div class="ui-popover" data-size="hint" id="ci-${sha}" popover>
      <dl class="ui-details">
        <dt>Name</dt><dd>check</dd>
        <dt>Outcome</dt><dd>${outcome === "passed" ? "Passed" : "Failed"}</dd>
        <dt>Finished</dt><dd>${date}, 09:41</dd>
        <dt>Command</dt><dd class="ui-mono">npm run check</dd>
      </dl>
    </div>
    <a class="ui-commit-sha" href="#${sha}">${sha}</a>
    <span class="ui-commit-subject">${subject}</span>
    <span class="ui-commit-author">${author}</span>
    <time datetime="2026-10-03">${date}</time>
  </li>`,
    )
    .join("")}
</ol>`;

export default { title: "Data/Commit list" } satisfies Meta;

export const Default = html(list);

export const CheckDetails: StoryObj = {
  ...html(list),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getAllByRole("button", { name: "check: Failed" })[0]!,
    );

    await expect(canvas.getAllByText("npm run check")[1]!).toBeVisible();
  },
};

export const Empty = html(`<p class="ui-empty">No commits.</p>`);

export const Mobile = mobile(list);
