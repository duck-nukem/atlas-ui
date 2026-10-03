import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";

type Args = { departments: string };

const percent = (value: number) => `${String(Math.round(value * 100))}%`;

const rate = (key: string, succeeded: number, reviewed: number) => {
  if (reviewed === 0) {
    return `<span><svg class="ui-ring" data-empty aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/></svg><span aria-hidden="true">–</span><span class="ui-sr-only">Nothing reviewed</span></span>`;
  }

  const hint = `${String(succeeded)} of ${String(reviewed)} succeeded`;

  return `<button type="button" popovertarget="rate-${key}" interestfor="rate-${key}"><svg class="ui-ring" aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/><circle cx="10" cy="10" r="8" pathLength="100" stroke-dasharray="${String((succeeded / reviewed) * 100)} 100"/></svg>${percent(succeeded / reviewed)}<span class="ui-sr-only">${hint}</span></button>
      <div class="ui-popover" id="rate-${key}" popover>${hint}</div>`;
};

export default {
  title: "Metrics/Goals by department",
  ...html<Args>(({ departments }) => {
    const rows = departments
      .split("|")
      .map((row) => row.split(",").map((part) => part.trim()))
      .filter((parts) => parts.length === 4)
      .map(([label = "", goals = "0", succeeded = "0", failed = "0"]) => ({
        label,
        key:
          label === "No department"
            ? "none"
            : label.toLowerCase().replaceAll(" ", "-"),
        goals: Number(goals),
        succeeded: Number(succeeded),
        reviewed: Number(succeeded) + Number(failed),
      }))
      .filter((row) => row.goals > 0);
    const total = rows.reduce((sum, row) => sum + row.goals, 0);

    return `<section class="ui-goal-departments" aria-labelledby="goals-by-department">
  <h2 id="goals-by-department">Goals by department</h2>
  ${
    rows.length === 0
      ? "<p>No goals yet</p>"
      : `<dl>
    ${rows
      .map(
        (
          row,
        ) => `<div data-testid="department-${row.key}" data-rate="${row.reviewed === 0 ? "" : percent(row.succeeded / row.reviewed)}">
      <dt>${row.label}</dt>
      <dd>${rate(row.key, row.succeeded, row.reviewed)}</dd>
      <dd>${String(row.goals)} ${row.goals === 1 ? "goal" : "goals"} · ${percent(row.goals / total)} of all</dd>
    </div>`,
      )
      .join("\n    ")}
  </dl>`
  }
</section>`;
  }),
  args: {
    departments:
      "Engineering, 4, 2, 0 | Legal, 1, 0, 0 | Marketing, 2, 0, 1 | No department, 2, 0, 0",
  },
} satisfies Meta<Args>;

export const Departments: Story<Args> = {};

export const NoGoals: Story<Args> = { args: { departments: "" } };

export const SuccessHint: Story<Args> = {
  play: async ({ canvas, userEvent }) => {
    const rate = canvas.getByRole("button", { name: /2 of 2 succeeded/ });

    await userEvent.click(rate);

    await expect(
      canvas.getByText("2 of 2 succeeded", { selector: "[popover]" }),
    ).toBeVisible();
  },
};
