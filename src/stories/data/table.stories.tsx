import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, icon, productionContrast, select, type Story } from "../html";

const rows = [
  [
    "T-327",
    "Change the timestamp's format and make sure it's in the clients' TZ",
    "Planned",
    "2 Oct 2026",
  ],
  ["T-328", "Enter/leave messages", "Planned", "2 Oct 2026"],
  [
    "T-313",
    "Implement @channel/@everyone/@here and block these as usernames on signup",
    "Planned",
    "1 Oct 2026",
  ],
  ["T-335", "Finalize the whole thing thanks", "Planned", "30 Sept 2026"],
] as const;

type TableArgs = {
  rows: number;
  sortedBy: "Key" | "Updated";
  descending: boolean;
  filtered: boolean;
  page: number;
  pages: number;
  total: number;
};

const sortHeader = (label: string, args: TableArgs) =>
  `<a class="ui-sort" href="#sort-${label}">${label}${args.sortedBy === label ? icon(args.descending ? "arrow-down" : "arrow-up") : ""}</a>`;

const filterButton = (
  label: string,
  active: boolean,
) => `<button class="ui-column-filter" type="button"${active ? " data-active" : ""} popovertarget="filter-${label}" aria-label="Filter ${label}">${icon("funnel")}</button>
<div class="ui-popover" data-size="filter" id="filter-${label}" popover>
  <form class="ui-filter-form" method="get" action="#tasks">
    <input class="ui-input" name="q" aria-label="Filter text" autofocus>
    <button class="ui-button" data-size="sm" type="submit">Apply</button>
  </form>
</div>`;

const table = (args: TableArgs) => `<div class="ui-data-table">
<div class="ui-table-scroll">
  <table class="ui-table">
    <thead>
      <tr>
        <th><span class="ui-th">${sortHeader("Key", args)}</span></th>
        <th><span class="ui-th">Task ${filterButton("Task", args.filtered)}</span></th>
        <th><span class="ui-th">Type ${filterButton("Type", false)}</span></th>
        <th><span class="ui-th">${sortHeader("Updated", args)}</span></th>
      </tr>
    </thead>
    <tbody>
      ${
        args.rows === 0
          ? '<tr><td class="ui-table-empty" colspan="4">No tasks match these filters</td></tr>'
          : rows
              .slice(0, args.rows)
              .map(
                ([key, title, type, updated]) =>
                  `<tr><td><span class="ui-key">${key}</span></td><td>${title}</td><td>${type}</td><td>${updated}</td></tr>`,
              )
              .join("\n      ")
      }
    </tbody>
  </table>
</div>
<nav class="ui-pagination" aria-label="Pagination">
  <span>Page ${args.page} of ${args.pages} (${args.total} total)</span>
  <div>${args.page > 1 ? '<a href="#previous">Previous</a>' : ""}${args.page < args.pages ? '<a href="#next">Next</a>' : ""}</div>
</nav>
</div>`;

export default {
  title: "Data/Table",
  ...html(table),
  args: {
    rows: 4,
    sortedBy: "Updated",
    descending: true,
    filtered: false,
    page: 2,
    pages: 5,
    total: 87,
  },
  argTypes: {
    rows: { control: { type: "range", min: 0, max: 4 } },
    sortedBy: select(["Key", "Updated"]),
  },
} satisfies Meta<TableArgs>;

export const Default: Story<TableArgs> = {};

export const Empty: Story<TableArgs> = {
  args: { rows: 0, page: 1, pages: 1, total: 0 },
};

export const ColumnFilterOpen: Story<TableArgs> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filter Task" }));

    await expect(
      canvas.getByRole("textbox", { name: "Filter text" }),
    ).toBeVisible();
  },
};

type FilterArgs = { field: string; value: string; hide: boolean };

export const FilterBar: Story<FilterArgs> = {
  ...html<FilterArgs>(
    ({ field, value, hide }) => `<div class="ui-filter-bar">
  <span class="ui-filter-chip">
    <button type="button" popovertarget="edit-filter" aria-label="Edit filter ${field} ${hide ? "≠" : ""} ${value}"><span>${field}</span><span><span title="${hide ? "≠ " : ""}${value}">${hide ? "≠ " : ""}${value}</span></span></button>
    <a href="#remove" aria-label="Remove filter ${field} ${value}">${icon("x")}</a>
  </span>
  <div class="ui-popover" data-size="filter" id="edit-filter" popover>
    <form class="ui-filter-form" method="get" action="#tasks">
      <div class="ui-negation"><button type="button" aria-pressed="${!hide}">Show</button><button type="button" aria-pressed="${hide}">Hide</button></div>
      <input class="ui-input" name="values" aria-label="Values" value="${value}">
      <button class="ui-button" data-size="sm" type="submit">Apply</button>
      <a href="#clear" aria-label="Clear">${icon("x")}</a>
    </form>
  </div>
  <button class="ui-button" data-variant="outline" data-size="sm" type="button" popovertarget="add-filter">Add filter</button>
  <div class="ui-popover" data-size="filter" id="add-filter" popover>
    <select aria-label="Column"><option>Task</option><option>Type</option><option>Status</option></select>
    <form class="ui-filter-form" method="get" action="#tasks">
      <input class="ui-input" name="q" aria-label="Filter text">
      <button class="ui-button" data-size="sm" type="submit">Apply</button>
    </form>
  </div>
  <a href="#clear-all">Clear all</a>
</div>`,
  ),
  args: { field: "Status", value: "Done", hide: true },
  parameters: { ...productionContrast },
};

type DateArgs = { from: string; to: string };

export const DateFilter: Story<DateArgs> = {
  ...html<DateArgs>(
    ({
      from,
      to,
    }) => `<form class="ui-filter-form" method="get" action="#tasks" style="max-width:26rem">
  <input class="ui-input" type="date" name="from" aria-label="From" value="${from}">
  <span class="ui-dash">–</span>
  <input class="ui-input" type="date" name="to" aria-label="To" value="${to}">
  <button class="ui-button" data-size="sm" type="submit">Apply</button>
</form>`,
  ),
  args: { from: "2026-09-01", to: "2026-09-30" },
};
