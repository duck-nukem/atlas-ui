import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const tasks = [
  [
    "T-128",
    "Export flow metrics as CSV",
    "In progress",
    2,
    "Ada Lovelace",
    "3 d",
  ],
  [
    "T-127",
    "Show join and leave lines in chat",
    "Ready",
    0,
    "Grace Hopper",
    "1 d",
  ],
  [
    "T-126",
    "Parse work item keys before lookups",
    "Done",
    3,
    "Alan Turing",
    "5 d",
  ],
  [
    "T-125",
    "Brand keys on entities and rows",
    "In review",
    4,
    "Katherine Johnson",
    "2 d",
  ],
] as const;

const filters = `
<form class="ui-filter-bar" method="get" action="#tasks" role="search" aria-label="Filter tasks">
  <div class="ui-field">
    <label class="ui-label" for="q">Search</label>
    <input class="ui-input" id="q" name="q" type="search" value="export">
  </div>
  <div class="ui-field">
    <label class="ui-label" for="status">Status</label>
    <select class="ui-input" id="status" name="status">
      <option value="">Any</option><option selected>In progress</option><option>Ready</option><option>Done</option>
    </select>
  </div>
  <button class="ui-button" data-variant="outline" type="submit">${icon("funnel")} Filter</button>
</form>
<ul class="ui-row" role="list" aria-label="Active filters" style="margin:0;padding:0;list-style:none">
  <li><span class="ui-badge" data-variant="secondary">Status: In progress <a class="ui-badge-remove" href="#tasks?q=export" aria-label="Remove Status: In progress">${icon("x", "sm")}</a></span></li>
  <li><a href="#tasks">Clear filters</a></li>
</ul>`;

const table = (stack: boolean) => {
  const row = (role: string) => (stack ? ` role="${role}"` : "");

  return `
<div class="ui-table-scroll" role="region" aria-label="Tasks" tabindex="0">
  <table class="ui-table"${stack ? ' data-stack role="table"' : ""}>
    <caption class="ui-visually-hidden">Tasks</caption>
    <thead${row("rowgroup")}>
      <tr${row("row")}>
        <th scope="col"${row("columnheader")} aria-sort="descending"><a class="ui-sort" href="#tasks?sort=key">Key</a></th>
        <th scope="col"${row("columnheader")}><a class="ui-sort" href="#tasks?sort=title">Title</a></th>
        <th scope="col"${row("columnheader")}>Status</th>
        <th scope="col"${row("columnheader")}>Assignee</th>
        <th scope="col"${row("columnheader")} data-align="end"><a class="ui-sort" href="#tasks?sort=age">Age</a></th>
      </tr>
    </thead>
    <tbody${row("rowgroup")}>
      ${tasks
        .map(
          ([key, title, status, tone, person, age]) => `
      <tr${row("row")}>
        <td${row("cell")} data-label="Key" data-nowrap><a href="#${key}">${key}</a></td>
        <td${row("cell")} data-label="Title">${title}</td>
        <td${row("cell")} data-label="Status"><span class="ui-badge" data-tone="${tone}">${status}</span></td>
        <td${row("cell")} data-label="Assignee">${person}</td>
        <td${row("cell")} data-label="Age" data-align="end">${age}</td>
      </tr>`,
        )
        .join("")}
    </tbody>
  </table>
</div>`;
};

const pagination = `
<nav class="ui-pagination" aria-label="Pagination">
  <span>21–40 of 312</span>
  <ol role="list">
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-1" rel="prev">${icon("chevron-left")} Previous</a></li>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-1" aria-label="Page 1">1</a></li>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-2" aria-current="page" aria-label="Page 2">2</a></li>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-3" aria-label="Page 3">3</a></li>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-3" rel="next">Next ${icon("chevron-right")}</a></li>
  </ol>
</nav>`;

export default {
  title: "Data/Table",
  parameters: {
    docs: {
      description: {
        component:
          "Sorting, filtering and paging are links and a GET form, so the server renders every state. data-stack turns rows into cards when the table is narrower than 40rem. A stacked table needs explicit table roles, because grid layout drops them in some browsers.",
      },
    },
  },
} satisfies Meta;

export const Full = html(
  `<div class="ui-stack">${filters}${table(true)}${pagination}</div>`,
);

export const Plain = html(table(false));

export const Empty = html(`
<div class="ui-table-scroll">
  <table class="ui-table">
    <caption class="ui-visually-hidden">Tasks</caption>
    <thead><tr><th scope="col">Key</th><th scope="col">Title</th></tr></thead>
    <tbody><tr><td class="ui-table-empty" colspan="2">No tasks match these filters</td></tr></tbody>
  </table>
</div>`);

export const Mobile = mobile(
  `<div class="ui-stack">${filters}${table(true)}${pagination}</div>`,
);

export const MobileScroll = mobile(table(false));
