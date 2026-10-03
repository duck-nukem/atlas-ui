import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, icon, mobile, withProductionContrast } from "../html";

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

const filter = (id: string, label: string, active = false) => `
<button class="ui-column-filter" type="button"${active ? " data-active" : ""} popovertarget="${id}" aria-label="Filter ${label}">${icon("funnel")}</button>
<div class="ui-popover" data-size="filter" id="${id}" popover>
  <form class="ui-filter-form" method="get" action="#tasks">
    <input class="ui-input" name="q" aria-label="Filter text">
    <button class="ui-button" data-size="sm" type="submit">Apply</button>
  </form>
</div>`;

const table = `
<div style="display:grid;gap:.75rem">
  <div class="ui-filter-bar">
    <span class="ui-filter-chip">
      <button type="button" aria-label="Edit filter Status ≠ Done"><span>Status</span><span>≠ Done</span></button>
      <a href="#tasks" aria-label="Remove filter Status ≠ Done">${icon("x")}</a>
    </span>
  </div>
  <div class="ui-table-scroll">
    <table class="ui-table">
      <thead>
        <tr>
          <th><span class="ui-th"><a class="ui-sort" href="#sort-key">Key</a></span></th>
          <th><span class="ui-th">Task ${filter("filter-task", "Task")}</span></th>
          <th><span class="ui-th">Type ${filter("filter-type", "Type")}</span></th>
          <th><span class="ui-th"><a class="ui-sort" href="#sort-updated">Updated${icon("arrow-down")}</a></span></th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(([key, title, type, updated]) => `<tr><td><span class="ui-key">${key}</span></td><td>${title}</td><td>${type}</td><td>${updated}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>
  <nav class="ui-pagination" aria-label="Pagination">
    <span>Page 2 of 5 (87 total)</span>
    <div><a href="#page-1">Previous</a><a href="#page-3">Next</a></div>
  </nav>
</div>`;

export default { title: "Data/Table" } satisfies Meta;

export const Default = html(table);

export const FilterOpen: StoryObj = {
  ...html(table),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filter Task" }));

    await expect(
      canvas.getByRole("textbox", { name: "Filter text" }),
    ).toBeVisible();
  },
};

export const ValuesFilter: StoryObj = withProductionContrast(
  html(`
<div class="ui-popover" data-size="filter" style="position:static;display:block">
  <form class="ui-filter-form" method="get" action="#tasks">
    <div class="ui-negation">
      <button type="button" aria-pressed="true">Show</button>
      <button type="button" aria-pressed="false">Hide</button>
    </div>
    <input class="ui-input" name="values" aria-label="Values" placeholder="Pick values">
    <button class="ui-button" data-size="sm" type="submit">Apply</button>
    <a href="#tasks" aria-label="Clear">${icon("x")}</a>
  </form>
</div>`),
);

export const DateFilter = html(`
<div class="ui-popover" data-size="filter" style="position:static;display:block">
  <form class="ui-filter-form" method="get" action="#tasks">
    <input class="ui-input" type="date" name="from" aria-label="From">
    <span class="ui-dash">–</span>
    <input class="ui-input" type="date" name="to" aria-label="To">
    <button class="ui-button" data-size="sm" type="submit">Apply</button>
  </form>
</div>`);

export const Empty = html(`
<div class="ui-table-scroll">
  <table class="ui-table">
    <thead><tr><th>Key</th><th>Task</th></tr></thead>
    <tbody><tr><td class="ui-table-empty" colspan="2">No tasks match these filters</td></tr></tbody>
  </table>
</div>`);

export const Mobile = mobile(table);
