import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";

type Args = { goals: string; today: string };

const statuses = {
  active: "Active",
  pending_review: "Pending review",
  succeeded: "Succeeded",
  failed: "Failed",
};

type Status = keyof typeof statuses;

const DAY = 86_400_000;
const COLUMN = 48;
const HEADER = 85;
const ROW = 36;
const BAR = 22;

const shiftMonth = (date: Date, months: number) => {
  const shifted = new Date(date);

  shifted.setUTCMonth(shifted.getUTCMonth() + months);

  return shifted;
};

const month = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const parse = (goals: string) =>
  goals
    .split("|")
    .map((goal) => goal.split(",").map((part) => part.trim()))
    .filter((parts) => parts.length === 5)
    .map(([label = "", status = "", start = "", end = "", progress = "0"]) => ({
      label,
      status: (status in statuses ? status : "active") as Status,
      start: new Date(start),
      end: new Date(end),
      progress: Number(progress) / 100,
    }));

const timeline = ({ goals, today }: Args) => {
  const rows = parse(goals);
  const first = shiftMonth(
    new Date(Math.min(...rows.map((row) => row.start.getTime()))),
    -1,
  );
  const last = shiftMonth(
    new Date(Math.max(...rows.map((row) => row.end.getTime()))),
    1,
  );
  const columns = Array.from(
    { length: Math.ceil((last.getTime() - first.getTime()) / (7 * DAY)) + 1 },
    (_, index) => new Date(first.getTime() + index * 7 * DAY),
  );
  const width = columns.length * COLUMN;
  const height = HEADER + rows.length * ROW + 4;
  const x = (date: Date) =>
    ((date.getTime() - first.getTime()) / DAY) * (COLUMN / 7);
  const now = new Date(today).getTime();
  const nowX = x(new Date(today));
  const months = columns
    .map((date, index) => ({ date, index }))
    .filter(
      ({ date, index }) =>
        index === 0 || columns[index - 1]?.getUTCMonth() !== date.getUTCMonth(),
    )
    .map(
      ({ date, index }) =>
        `<text x="${String(index * COLUMN)}" y="25.5">${month.format(date)}</text>`,
    )
    .join("");
  const days = columns
    .map((date, index) => {
      const left = index * COLUMN;
      const current = now >= date.getTime() && now < date.getTime() + 7 * DAY;

      return `${current ? `<rect x="${String(left)}" y="50" width="38.4" height="24" rx="5"/>` : ""}<text x="${String(left + 19.2)}" y="62">${String(date.getUTCDate())}</text>`;
    })
    .join("");
  const grid = [
    ...rows.map(
      (_, index) =>
        `<rect y="${String(HEADER + index * ROW)}" width="${String(width)}" height="${String(ROW)}"/>`,
    ),
    ...rows.map(
      (_, index) =>
        `<line x2="${String(width)}" y1="${String(HEADER + (index + 1) * ROW)}" y2="${String(HEADER + (index + 1) * ROW)}"/>`,
    ),
    ...columns.map(
      (date, index) =>
        `<path d="M ${String(index * COLUMN)} ${String(HEADER)} v ${String(height - HEADER)}"${date.getUTCDate() <= 7 ? " data-thick" : ""}/>`,
    ),
  ].join("");
  const bars = rows
    .map((row, index) => {
      const left = x(row.start);
      const span = x(new Date(row.end.getTime() + DAY)) - left;
      const top = HEADER + 7 + index * ROW;
      const label = `${row.label} · ${String(Math.round(row.progress * 100))}%`;
      const inside = label.length * 6.1 <= span;

      return `<a href="#${row.label.split(" ")[0] ?? ""}" data-status="${row.status}"><rect x="${left.toFixed(2)}" y="${String(top)}" width="${span.toFixed(2)}" height="${String(BAR)}" rx="3"/><rect x="${left.toFixed(2)}" y="${String(top)}" width="${(span * row.progress).toFixed(2)}" height="${String(BAR)}" rx="5"/><text x="${(inside ? left + span / 2 : left + span + 5).toFixed(2)}" y="${String(top + BAR / 2)}"${inside ? " data-inside" : ""}>${label}</text></a>`;
    })
    .join("\n        ");

  return `<figure class="ui-timeline" aria-label="Goal timeline">
    <div data-testid="timeline-scroll">
      <svg width="${String(width)}" height="${String(height)}">
        <g class="ui-timeline-header" aria-hidden="true"><rect width="${String(width)}" height="${String(HEADER)}"/><line x2="${String(width)}" y1="${String(HEADER - 0.5)}" y2="${String(HEADER - 0.5)}"/><g>${months}</g><g>${days}</g></g>
        <g class="ui-timeline-grid" aria-hidden="true">${grid}</g>
        <g class="ui-timeline-bars">
        ${bars}
        </g>${nowX >= 0 && nowX <= width ? `\n        <g class="ui-timeline-now" aria-hidden="true"><line x1="${nowX.toFixed(2)}" x2="${nowX.toFixed(2)}" y1="${String(HEADER)}" y2="${String(height)}"/><circle cx="${nowX.toFixed(2)}" cy="${String(HEADER - 3)}" r="3"/></g>` : ""}
      </svg>
    </div>
    <figcaption class="ui-sr-only">${rows.map((row) => `${row.label}: ${day.format(row.start)} to ${day.format(row.end)}, ${String(Math.round(row.progress * 100))}% done`).join(". ")}</figcaption>
  </figure>
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
            "One bar per goal from creation to target date, filled to task completion and coloured by status. The caller places bars with SVG attributes, which a strict CSP allows.",
        },
      },
    },
  ),
  args: {
    today: "2026-10-03T19:00Z",
    goals:
      "G-6 Code review follow-ups, succeeded, 2026-09-15, 2026-09-15, 100 | G-4 Technical excellence, failed, 2026-09-14, 2026-09-16, 96 | G-5 Increase reach, pending_review, 2026-09-14, 2026-09-16, 100 | G-3 UI Change preparation, succeeded, 2026-09-14, 2026-09-17, 100 | G-10 Reshape the task list, pending_review, 2026-09-28, 2026-09-30, 33 | G-9 Production release, pending_review, 2026-09-17, 2026-09-30, 100 | G-11 Import, active, 2026-10-01, 2026-10-30, 0 | G-7 Provide useful suggestions to our customers, pending_review, 2026-09-15, 2026-10-31, 85 | G-8 GDPR Compliance, active, 2026-09-16, 2026-12-31, 100",
  },
} satisfies Meta<Args>;

export const Timeline: Story<Args> = {};

export const NoGoals: Story<Args> = { args: { goals: "" } };

export const ScrollsInside: Story<Args> = {
  args: {
    goals:
      "G-12 Rebuild the platform, active, 2026-01-05, 2027-12-31, 20 | G-13 Expand to new markets, pending_review, 2026-03-02, 2027-06-30, 60",
  },
  play: async ({ canvas }) => {
    const section = canvas.getByTestId("timeline-scroll").closest("section")!;

    await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
  },
};
