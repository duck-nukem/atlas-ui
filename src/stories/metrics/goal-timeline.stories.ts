import type { Meta } from "@storybook/html-vite";
import { expect, waitFor } from "storybook/test";
import { html, type Story } from "../html";

type Args = { goals: string };

const statuses = {
  active: "Active",
  pending_review: "Pending review",
  succeeded: "Succeeded",
  failed: "Failed",
};

type Status = keyof typeof statuses;

const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const fromToday = (days: string) => {
  const date = new Date();

  date.setDate(date.getDate() + Number(days));

  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const parse = (goals: string) =>
  goals
    .split("|")
    .map((goal) => goal.split(",").map((part) => part.trim()))
    .filter((parts) => parts.length === 5)
    .map(([label = "", status = "", start = "", end = "", progress = "0"]) => ({
      label,
      status: (status in statuses ? status : "active") as Status,
      start: fromToday(start),
      end: fromToday(end),
      progress: Number(progress) / 100,
    }));

const timeline = ({ goals }: Args) => {
  const rows = parse(goals);

  return `<atlas-gantt lang="en-GB" role="figure" aria-label="Goal timeline">
    <ul>
      ${rows
        .map(
          (row) =>
            `<li data-status="${row.status}" data-start="${row.start}" data-end="${row.end}" data-progress="${String(row.progress)}"><a href="#${row.label.split(" ")[0] ?? ""}">${row.label}</a>: ${day.format(new Date(row.start))} to ${day.format(new Date(row.end))}, ${String(Math.round(row.progress * 100))}% done</li>`,
        )
        .join("\n      ")}
    </ul>
  </atlas-gantt>
  <ul class="ui-timeline-legend" aria-label="Timeline colors">
    ${Object.entries(statuses)
      .map(
        ([status, name]) =>
          `<li data-testid="legend-${status}" data-status="${status}">${name}</li>`,
      )
      .join("\n    ")}
  </ul>`;
};

export default {
  title: "Metrics/Goal timeline",
  ...html<Args>(
    (args) => `<section class="ui-goal-timeline">
  <h2>Timeline to target dates</h2>
  <p data-testid="timeline-hint">Each bar runs from creation to the target date, the filled part is task completion.</p>
  ${parse(args.goals).length === 0 ? "" : timeline(args)}
</section>`,
    {
      docs: {
        description: {
          component:
            "One bar per goal from creation to target date, filled to task completion and coloured by status. Each goal is written as key and title, status, start and end in days from today, and percent done. The server renders the goals as a list; <atlas-gantt> draws them with frappe-gantt and keeps the list for screen readers. Without JavaScript the list is what shows.",
        },
      },
    },
  ),
  args: {
    goals:
      "G-6 Code review follow-ups, succeeded, -18, -18, 100 | G-4 Technical excellence, failed, -19, -17, 96 | G-5 Increase reach, pending_review, -19, -17, 100 | G-3 UI Change preparation, succeeded, -19, -16, 100 | G-10 Reshape the task list, pending_review, -5, -3, 33 | G-9 Production release, pending_review, -16, -3, 100 | G-11 Import, active, -2, 27, 0 | G-7 Provide useful suggestions to our customers, pending_review, -18, 28, 85 | G-8 GDPR Compliance, active, -17, 89, 100",
  },
} satisfies Meta<Args>;

export const Timeline: Story<Args> = {};

export const NoGoals: Story<Args> = { args: { goals: "" } };

export const ScrollsInside: Story<Args> = {
  args: {
    goals:
      "G-12 Rebuild the platform, active, -271, 454, 20 | G-13 Expand to new markets, pending_review, -215, 270, 60",
  },
  globals: { viewport: { value: "mobile" } },
  play: async ({ canvas }) => {
    const chart = canvas.getByRole("figure", { name: "Goal timeline" });
    await waitFor(() =>
      expect(chart.querySelectorAll("[class~='bar-wrapper']")).toHaveLength(2),
    );
    const section = chart.closest("section")!;

    await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
  },
};
